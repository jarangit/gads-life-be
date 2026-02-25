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

      if (tags?.length) {
        const toSave = tags.map((tag) =>
          tagRepo.create({
            ...tag,
            articleId: article.id,
          }),
        );
        await tagRepo.save(toSave);
      }

      return articleRepo.findOne({
        where: { id: article.id },
        relations: ['sections', 'tags'],
        relationLoadStrategy: 'query',
      });
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

    return buildPaginationResult({ items, total, page, limit });
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

    return article;
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

      let publishedAt = existing.publishedAt;
      if (dto.publishedAt === null) {
        publishedAt = null;
      } else if (dto.publishedAt) {
        publishedAt = new Date(dto.publishedAt as any);
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
        await tagRepo.delete({ articleId: id });
        if (tags.length) {
          const toSave = tags.map((tag) =>
            tagRepo.create({
              ...tag,
              articleId: id,
            }),
          );
          await tagRepo.save(toSave);
        }
      }

      return articleRepo.findOne({
        where: { id },
        relations: ['sections', 'tags'],
        relationLoadStrategy: 'query',
      });
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
}
