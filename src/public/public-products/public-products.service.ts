import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { Product } from '../../admin/products/entities/product.entity';
import { ProductStatus } from '../../admin/products/dto/validate.dto';
import {
  buildPaginationOptions,
  buildPaginationResult,
  PaginationResult,
} from '../../common/dto/pagination-query.dto';
import {
  FindPublicProductsDto,
  PublicProductSort,
} from './dto/find-public-products.dto';

export type PublicProductResponse = {
  id: string;
  name: string;
  subtitle: string;
  image: string | null;
  overallScore: number;
  isRecommended: boolean;
  price: number;
  currency: string;
  priceLabel: string;
  affiliateLink: string | null;
  lastUpdated: string;
  status: ProductStatus;
  categoryId: string | null;
  brandId: string | null;
  category: Product['category'];
  brand: Product['brand'];
  ratings: Product['ratings'];
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PublicProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    query: FindPublicProductsDto,
  ): Promise<PaginationResult<PublicProductResponse>> {
    const { page, limit, skip } = buildPaginationOptions(query);

    const where: FindOptionsWhere<Product> = {
      status: ProductStatus.PUBLISHED,
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.brandId) {
      where.brandId = query.brandId;
    }

    const [items, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category', 'brand', 'ratings'],
      order: this.resolveSort(query.sort),
      skip,
      take: limit,
    });

    return buildPaginationResult({
      items: items.map((item) => this.toPublicProduct(item)),
      total,
      page,
      limit,
    });
  }

  async findOne(id: string): Promise<PublicProductResponse> {
    const product = await this.productRepository.findOne({
      where: { id, status: ProductStatus.PUBLISHED },
      relations: ['category', 'brand', 'ratings'],
    });

    if (!product) {
      throw new NotFoundException(`Published product with id "${id}" not found`);
    }

    return this.toPublicProduct(product);
  }

  private resolveSort(sort?: PublicProductSort): FindOptionsOrder<Product> {
    switch (sort) {
      case 'priceAsc':
        return { price: 'ASC', createdAt: 'DESC' };
      case 'priceDesc':
        return { price: 'DESC', createdAt: 'DESC' };
      case 'scoreDesc':
        return { overallScore: 'DESC', createdAt: 'DESC' };
      case 'latest':
      default:
        return { createdAt: 'DESC' };
    }
  }

  private toPublicProduct(product: Product): PublicProductResponse {
    return {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image ?? null,
      overallScore: Number(product.overallScore),
      isRecommended: product.isRecommended,
      price: product.price,
      currency: product.currency,
      priceLabel: product.priceLabel,
      affiliateLink: product.affiliateLink ?? null,
      lastUpdated: product.lastUpdated,
      status: product.status,
      categoryId: product.categoryId,
      brandId: product.brandId,
      category: product.category,
      brand: product.brand,
      ratings: product.ratings,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
