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
import type { PublicCollectionResponse } from './types/public-collection.type';
import type { PublicCollectionItemResponse } from './types/public-collection-item.type';
import type { PublicCollectionProductResponse } from './types/public-collection-product.type';
import { CollectionItem } from '../../admin/collection-item/entities/collection-item.entity';
import { Product } from '../../admin/products/entities/product.entity';

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

    // const now = new Date();

    // const qb = this.collectionRepository
    //   .createQueryBuilder('collection')
    //   .leftJoinAndSelect('collection.category', 'category')
    //   .where('collection.status = :status', {
    //     status: CollectionStatus.PUBLISHED,
    //   })
    //   .andWhere('collection.publishedAt IS NOT NULL')
    //   .andWhere('collection.publishedAt <= :now', { now })
    //   .orderBy('collection.publishedAt', 'DESC')
    //   .skip(skip)
    //   .take(limit);

    // if (query.categoryId) {
    //   qb.andWhere('collection.categoryId = :categoryId', {
    //     categoryId: query.categoryId,
    //   });
    // }

    // if (query.type) {
    //   qb.andWhere('collection.type = :type', { type: query.type });
    // }

    // const [items, total] = await qb.getManyAndCount();
    const [items, total] = await this.collectionRepository.findAndCount({
      where: {
        status: CollectionStatus.PUBLISHED,
      },
      relations: ['category', 'items', 'items.product'],
      order: { publishedAt: 'DESC' },
      skip,
      take: limit,
    });

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
      category: collection.category
        ? {
            id: collection.category.id,
            slug: collection.category.slug,
            nameTh: collection.category.nameTh,
            nameEn: collection.category.nameEn ?? null,
          }
        : null,
      status: collection.status,
      publishedAt: collection.publishedAt ?? null,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      items: (collection.items ?? []).map((item) =>
        this.toPublicCollectionItem(item),
      ),
    };
  }

  private toPublicCollectionItem(
    item: CollectionItem,
  ): PublicCollectionItemResponse {
    return {
      id: item.id,
      collectionId: item.collectionId,
      productId: item.productId,
      product: this.toPublicCollectionProduct(item.product),
      orderIndex: item.orderIndex,
      originalPrice: item.originalPrice ?? null,
      dealPrice: item.dealPrice ?? null,
      currency: item.currency,
      dealStartAt: item.dealStartAt ?? null,
      dealEndAt: item.dealEndAt ?? null,
      dealBadge: item.dealBadge ?? null,
      dealUrl: item.dealUrl ?? null,
      note: item.note ?? null,
      createdAt: item.createdAt,
    };
  }

  private toPublicCollectionProduct(
    product: Product,
  ): PublicCollectionProductResponse {
    return {
      id: product.id,
      slug: product.slug ?? null,
      categoryId: product.categoryId ?? null,
      brandId: product.brandId ?? null,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image ?? null,
      overallScore: product.overallScore,
      isRecommended: product.isRecommended,
      price: product.price,
      currency: product.currency,
      priceLabel: product.priceLabel,
      affiliateLink: product.affiliateLink ?? null,
      lastUpdated: product.lastUpdated,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      status: product.status,
    };
  }
}
