import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import {
  Collection,
  CollectionStatus,
} from '../../admin/collection/entities/collection.entity';
import {
  buildPaginationOptions,
  buildPaginationResult,
  PaginationResult,
} from '../../common/dto/pagination-query.dto';
import { FindPublicCollectionsDto } from './dto/find-public-collections.dto';

export type PublicCollectionResponse = {
  id: string;
  type: Collection['type'];
  slug: string;
  titleTh: string;
  titleEn: string | null;
  excerpt: string | null;
  coverImage: string | null;
  categoryId: string | null;
  status: CollectionStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: Collection['category'];
};

@Injectable()
export class PublicCollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async findAll(
    query: FindPublicCollectionsDto,
  ): Promise<PaginationResult<PublicCollectionResponse>> {
    const { page, limit, skip } = buildPaginationOptions(query);

    const now = new Date();

    const qb = this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.category', 'category')
      .where('collection.status = :status', { status: CollectionStatus.PUBLISHED })
      .andWhere('collection.publishedAt IS NOT NULL')
      .andWhere('collection.publishedAt <= :now', { now })
      .orderBy('collection.publishedAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.categoryId) {
      qb.andWhere('collection.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.type) {
      qb.andWhere('collection.type = :type', { type: query.type });
    }

    const [items, total] = await qb.getManyAndCount();

    return buildPaginationResult({
      items: items.map((item) => this.toPublicCollection(item)),
      total,
      page,
      limit,
    });
  }

  async findOne(slug: string): Promise<PublicCollectionResponse> {
    const collection = await this.collectionRepository.findOne({
      where: {
        slug,
        status: CollectionStatus.PUBLISHED,
        publishedAt: LessThanOrEqual(new Date()),
      },
      relations: ['category'],
    });

    if (!collection) {
      throw new NotFoundException(
        `Published collection with slug "${slug}" not found`,
      );
    }

    return this.toPublicCollection(collection);
  }

  private toPublicCollection(collection: Collection): PublicCollectionResponse {
    return {
      id: collection.id,
      type: collection.type,
      slug: collection.slug,
      titleTh: collection.titleTh,
      titleEn: collection.titleEn ?? null,
      excerpt: collection.excerpt ?? null,
      coverImage: collection.coverImage ?? null,
      categoryId: collection.categoryId ?? null,
      status: collection.status,
      publishedAt: collection.publishedAt ?? null,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      category: collection.category,
    };
  }
}
