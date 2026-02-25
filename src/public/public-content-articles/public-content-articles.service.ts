import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import {
  ContentArticle,
  ContentStatus,
} from '../../admin/content-articles/entities/content-article.entity';
import { ContentTag } from '../../admin/content-articles/entities/content-tag.entity';
import {
  buildPaginationOptions,
  buildPaginationResult,
  PaginationResult,
} from '../../common/dto/pagination-query.dto';
import {
  FindPublicContentArticlesDto,
  PublicContentArticleSort,
} from './dto/find-public-content-articles.dto';

export type PublicContentArticleListItem = {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  excerpt: string | null;
  type: ContentArticle['type'];
  publishedAt: Date | null;
  isFeatured: number;
  heroImage: string | null;
  heroImageAlt: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type PublicContentArticleDetail = PublicContentArticleListItem & {
  metaTitle: string | null;
  metaDescription: string | null;
  sections: {
    id: number;
    heading: string | null;
    body: string;
    sortOrder: number;
  }[];
};

@Injectable()
export class PublicContentArticlesService {
  constructor(
    @InjectRepository(ContentArticle)
    private readonly articleRepository: Repository<ContentArticle>,
    @InjectRepository(ContentTag)
    private readonly tagRepository: Repository<ContentTag>,
  ) {}

  async findAll(
    query: FindPublicContentArticlesDto,
  ): Promise<PaginationResult<PublicContentArticleListItem>> {
    const { page, limit, skip } = buildPaginationOptions(query);

    const qb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.tags', 'tag')
      .where('article.status = :status', { status: ContentStatus.PUBLISHED })
      .distinct(true);

    if (query.search) {
      const term = `%${query.search.trim()}%`;
      qb.andWhere(
        '(article.title LIKE :term OR article.summary LIKE :term OR article.excerpt LIKE :term)',
        { term },
      );
    }

    if (query.type) {
      qb.andWhere('article.type = :type', { type: query.type });
    }

    if (query.isFeatured !== undefined) {
      qb.andWhere('article.isFeatured = :isFeatured', {
        isFeatured: query.isFeatured,
      });
    }

    if (query.tag) {
      qb.andWhere('tag.value = :tag', { tag: query.tag.trim() });
    }

    this.applySort(qb, query.sort);

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    const tagsByArticle = await this.loadTags(
      items.map((article) => article.id),
    );

    return buildPaginationResult({
      items: items.map((article) =>
        this.toListItem(article, tagsByArticle[article.id] ?? []),
      ),
      total,
      page,
      limit,
    });
  }

  async findOne(id: number): Promise<PublicContentArticleDetail> {
    const article = await this.articleRepository.findOne({
      where: { id, status: ContentStatus.PUBLISHED },
      relations: ['sections', 'tags'],
      relationLoadStrategy: 'query',
    });

    if (!article) {
      throw new NotFoundException('Published article not found');
    }

    return this.toDetail(article);
  }

  async findBySlug(slug: string): Promise<PublicContentArticleDetail> {
    const article = await this.articleRepository.findOne({
      where: { slug, status: ContentStatus.PUBLISHED },
      relations: ['sections', 'tags'],
      relationLoadStrategy: 'query',
    });

    if (!article) {
      throw new NotFoundException(
        `Published article with slug "${slug}" not found`,
      );
    }

    return this.toDetail(article);
  }

  private applySort(
    qb: SelectQueryBuilder<ContentArticle>,
    sort?: PublicContentArticleSort,
  ) {
    const orderNullsLast = () =>
      qb.orderBy('article.publishedAt IS NULL', 'ASC');

    switch (sort) {
      case 'oldest':
        orderNullsLast()
          .addOrderBy('article.publishedAt', 'ASC')
          .addOrderBy('article.createdAt', 'ASC');
        break;
      case 'latest':
      default:
        orderNullsLast()
          .addOrderBy('article.publishedAt', 'DESC')
          .addOrderBy('article.createdAt', 'DESC');
        break;
    }
  }

  private toListItem(
    article: ContentArticle,
    tags: string[],
  ): PublicContentArticleListItem {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary ?? null,
      excerpt: article.excerpt ?? null,
      type: article.type,
      publishedAt: article.publishedAt ?? null,
      isFeatured: article.isFeatured,
      heroImage: article.heroImage ?? null,
      heroImageAlt: article.heroImageAlt ?? null,
      tags,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  private toDetail(article: ContentArticle): PublicContentArticleDetail {
    const sortedSections =
      article.sections?.sort((a, b) => a.sortOrder - b.sortOrder) ?? [];

    return {
      ...this.toListItem(article, article.tags?.map((tag) => tag.value) ?? []),
      metaTitle: article.metaTitle ?? null,
      metaDescription: article.metaDescription ?? null,
      sections: sortedSections.map((section) => ({
        id: section.id,
        heading: section.heading ?? null,
        body: section.body,
        sortOrder: section.sortOrder,
      })),
    };
  }

  private async loadTags(
    articleIds: number[],
  ): Promise<Record<number, string[]>> {
    if (!articleIds.length) {
      return {};
    }

    const tags = await this.tagRepository.find({
      where: { articleId: In(articleIds) },
    });

    return tags.reduce<Record<number, string[]>>((acc, tag) => {
      acc[tag.articleId] = acc[tag.articleId] || [];
      acc[tag.articleId].push(tag.value);
      return acc;
    }, {});
  }
}
