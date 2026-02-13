import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../../admin/brands/entities/brand.entity';
import { Product } from '../../admin/products/entities/product.entity';
import { ProductStatus } from '../../admin/products/dto/validate.dto';
import {
  buildPaginationOptions,
  buildPaginationResult,
  PaginationResult,
} from '../../common/dto/pagination-query.dto';
import { FindPublicBrandsDto } from './dto/find-public-brands.dto';

export type PublicBrandResponse = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  ogImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  isIndexable: boolean;
  isFollowable: boolean;
  schemaJsonLd: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  publishedProductsCount: number;
};

@Injectable()
export class PublicBrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    query: FindPublicBrandsDto,
  ): Promise<PaginationResult<PublicBrandResponse>> {
    const { page, limit, skip } = buildPaginationOptions(query);

    const totalRow = await this.brandRepository
      .createQueryBuilder('brand')
      .innerJoin(
        Product,
        'product',
        'product.brandId = brand.id AND product.status = :status',
        { status: ProductStatus.PUBLISHED },
      )
      .select('COUNT(DISTINCT brand.id)', 'total')
      .getRawOne<{ total: string }>();

    const total = Number(totalRow?.total ?? 0);

    const { entities, raw } = await this.brandRepository
      .createQueryBuilder('brand')
      .innerJoin(
        Product,
        'product',
        'product.brandId = brand.id AND product.status = :status',
        { status: ProductStatus.PUBLISHED },
      )
      .select('brand')
      .addSelect('COUNT(product.id)', 'published_products_count')
      .groupBy('brand.id')
      .orderBy('brand.name', 'ASC')
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    const items = entities.map((brand, index) => {
      const count = Number(raw[index]?.published_products_count ?? 0);
      return this.toPublicBrand(brand, count);
    });

    return buildPaginationResult({
      items,
      total,
      page,
      limit,
    });
  }

  async findOne(id: string): Promise<PublicBrandResponse> {
    const brand = await this.brandRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException(`Brand with id "${id}" not found`);
    }

    const publishedProductsCount = await this.productRepository.count({
      where: {
        brandId: id,
        status: ProductStatus.PUBLISHED,
      },
    });

    if (publishedProductsCount < 1) {
      throw new NotFoundException(`Brand with id "${id}" not found`);
    }

    return this.toPublicBrand(brand, publishedProductsCount);
  }

  private toPublicBrand(
    brand: Brand,
    publishedProductsCount: number,
  ): PublicBrandResponse {
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      tagline: brand.tagline ?? null,
      description: brand.description ?? null,
      logoUrl: brand.logoUrl ?? null,
      ogImageUrl: brand.ogImageUrl ?? null,
      metaTitle: brand.metaTitle ?? null,
      metaDescription: brand.metaDescription ?? null,
      canonicalUrl: brand.canonicalUrl ?? null,
      isIndexable: brand.isIndexable,
      isFollowable: brand.isFollowable,
      schemaJsonLd: (brand.schemaJsonLd as Record<string, unknown>) ?? null,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
      publishedProductsCount,
    };
  }
}
