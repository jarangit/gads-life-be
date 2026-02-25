import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateContentArticleDto } from './dto/create-content-article.dto';
import { UpdateContentArticleDto } from './dto/update-content-article.dto';
import { FindContentArticleQueryDto } from './dto/find-content-article.dto';
import {
  ContentArticle,
  ContentStatus,
} from './entities/content-article.entity';
import { ContentSection } from './entities/content-section.entity';
import { ContentTag } from './entities/content-tag.entity';
import {
  buildPaginationOptions,
  buildPaginationResult,
  PaginationResult,
} from '../../common/dto/pagination-query.dto';

@Injectable()
export class ContentArticlesService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(ContentArticle)
    private readonly articleRepository: Repository<ContentArticle>,

    @InjectRepository(ContentSection)
    private readonly sectionRepository: Repository<ContentSection>,

    @InjectRepository(ContentTag)
    private readonly tagRepository: Repository<ContentTag>,
  ) {}

  async create(dto: CreateContentArticleDto) {
    const existing = await this.articleRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Article with this slug already exists');
    }

    return this.dataSource.transaction(async (manager) => {
      const articleRepo = manager.getRepository(ContentArticle);
      const sectionRepo = manager.getRepository(ContentSection);
      const tagRepo = manager.getRepository(ContentTag);

      const { sections, tags, ...articleData } = dto;
      const normalizedTags = this.normalizeTagValues(tags);

      const article = articleRepo.create({
        ...articleData,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
        status: dto.status ?? ContentStatus.DRAFT,
        isFeatured: dto.isFeatured ?? 0,
      });
      await articleRepo.save(article);

      if (sections?.length) {
        const toSave = sections.map((section) =>
          sectionRepo.create({
            ...section,
            articleId: article.id,
          }),
        );
        await sectionRepo.save(toSave);
      }

      if (normalizedTags.length) {
        await this.syncArticleTags(tagRepo, article.id, normalizedTags);
      }

      const savedArticle = await articleRepo.findOne({
        where: { id: article.id },
        relations: ['sections', 'tags'],
        relationLoadStrategy: 'query',
      });

      return savedArticle ? this.withUniqueTags(savedArticle) : savedArticle;
    });
  }

  async findAll(
    query: FindContentArticleQueryDto,
  ): Promise<PaginationResult<ContentArticle>> {
    const { page, limit, skip } = buildPaginationOptions(query);
    const where: Record<string, unknown> = {};

    if (query?.type) where['type'] = query.type;
    if (query?.status) where['status'] = query.status;
    if (query?.isFeatured !== undefined) where['isFeatured'] = query.isFeatured;

    const [items, total] = await this.articleRepository.findAndCount({
      where,
      relations: ['sections', 'tags'],
      order: {
        publishedAt: 'DESC',
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    return buildPaginationResult({
      items: items.map((item) => this.withUniqueTags(item)),
      total,
      page,
      limit,
    });
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['sections', 'tags'],
      relationLoadStrategy: 'query',
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return this.withUniqueTags(article);
  }

  async update(id: number, dto: UpdateContentArticleDto) {
    const existing = await this.articleRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Article not found');
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugOwner = await this.articleRepository.findOne({
        where: { slug: dto.slug },
      });
      if (slugOwner && slugOwner.id !== id) {
        throw new ConflictException('Article with this slug already exists');
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const articleRepo = manager.getRepository(ContentArticle);
      const sectionRepo = manager.getRepository(ContentSection);
      const tagRepo = manager.getRepository(ContentTag);

      const { sections, tags, ...articleData } = dto;
      const normalizedTags = this.normalizeTagValues(tags);

      let publishedAt = existing.publishedAt;
      if (dto.publishedAt === null) {
        publishedAt = null;
      } else if (dto.publishedAt) {
        publishedAt = new Date(dto.publishedAt);
      }

      await articleRepo.update(id, {
        ...articleData,
        publishedAt,
      });

      if (sections !== undefined) {
        await sectionRepo.delete({ articleId: id });
        if (sections.length) {
          const toSave = sections.map((section) =>
            sectionRepo.create({
              ...section,
              articleId: id,
            }),
          );
          await sectionRepo.save(toSave);
        }
      }

      if (tags !== undefined) {
        await this.syncArticleTags(tagRepo, id, normalizedTags);
      }

      const savedArticle = await articleRepo.findOne({
        where: { id },
        relations: ['sections', 'tags'],
        relationLoadStrategy: 'query',
      });

      return savedArticle ? this.withUniqueTags(savedArticle) : savedArticle;
    });
  }

  async remove(id: number) {
    const existing = await this.articleRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Article not found');
    }

    await this.articleRepository.delete(id);
    return { success: true };
  }

  async removeTag(articleId: number, tagId: number) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const tag = await this.tagRepository.findOne({
      where: { id: tagId, articleId },
    });
    if (!tag) {
      throw new NotFoundException('Tag not found for this article');
    }

    await this.tagRepository.delete(tagId);

    return { success: true };
  }

  private normalizeTagValues(tags?: { value: string }[]): string[] {
    if (!tags?.length) {
      return [];
    }

    const seen = new Set<string>();
    const values: string[] = [];

    for (const tag of tags) {
      const normalizedValue = this.normalizeTagValue(tag.value);
      if (!normalizedValue) {
        continue;
      }

      const dedupeKey = normalizedValue.toLowerCase();
      if (seen.has(dedupeKey)) {
        continue;
      }

      seen.add(dedupeKey);
      values.push(normalizedValue);
    }

    return values;
  }

  private async syncArticleTags(
    tagRepo: Repository<ContentTag>,
    articleId: number,
    requestedValues: string[],
  ): Promise<void> {
    const existingTags = await tagRepo.find({
      where: { articleId },
    });

    const existingByKey = new Map<string, ContentTag>();
    const duplicateExistingIds: number[] = [];
    const toNormalizeUpdate: ContentTag[] = [];

    for (const tag of existingTags) {
      const key = this.normalizeTagValue(tag.value);

      if (!key) {
        duplicateExistingIds.push(tag.id);
        continue;
      }

      if (tag.value !== key) {
        tag.value = key;
        toNormalizeUpdate.push(tag);
      }

      if (!existingByKey.has(key)) {
        existingByKey.set(key, tag);
      } else {
        duplicateExistingIds.push(tag.id);
      }
    }

    const requestedKeys = new Set(requestedValues.map((value) => value));

    const toCreate = requestedValues
      .filter((value) => !existingByKey.has(value))
      .map((value) =>
        tagRepo.create({
          articleId,
          value,
        }),
      );

    const toDeleteIds = existingTags
      .filter((tag) => !requestedKeys.has(this.normalizeTagValue(tag.value)))
      .map((tag) => tag.id);

    const allDeleteIds = Array.from(
      new Set([...toDeleteIds, ...duplicateExistingIds]),
    );

    if (toNormalizeUpdate.length) {
      await tagRepo.save(toNormalizeUpdate);
    }

    if (toCreate.length) {
      await tagRepo.save(toCreate);
    }

    if (allDeleteIds.length) {
      await tagRepo.delete(allDeleteIds);
    }
  }

  private withUniqueTags(article: ContentArticle): ContentArticle {
    if (!article.tags?.length) {
      return article;
    }

    const seen = new Set<string>();
    article.tags = article.tags.filter((tag) => {
      const key = this.normalizeTagValue(tag.value);
      if (!key || seen.has(key)) {
        return false;
      }

      seen.add(key);
      tag.value = key;
      return true;
    });

    return article;
  }

  private normalizeTagValue(value: string): string {
    return value.trim().replace(/\s+/g, ' ').toLowerCase();
  }
}
