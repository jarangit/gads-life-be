import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { Product } from '../../admin/products/entities/product.entity';
import { ProductStatus } from '../../admin/products/dto/validate.dto';
import { ProductKeyHighlight } from '../../admin/products/entities/product-key-highlight.entity';
import { ProductWeakness } from '../../admin/products/entities/product-weakness.entity';
import { ProductBeforePurchasePoint } from '../../admin/products/entities/product-before-purchase-point.entity';
import { ProductAfterUsagePoint } from '../../admin/products/entities/product-after-usage-point.entity';
import { ProductPro } from '../../admin/products/entities/product-pro.entity';
import { ProductCon } from '../../admin/products/entities/product-con.entity';
import { ProductQuickVerdict } from '../../admin/products/entities/product-quick-verdict.entity';
import { ProductQuickVerdictTag } from '../../admin/products/entities/product-quick-verdict-tag.entity';
import { ProductPricing } from '../../admin/products/entities/product-pricing.entity';
import { ProductFinalVerdictPoint } from '../../admin/products/entities/product-final-verdict-point.entity';
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
  slug?: string;
  subtitle: string;
  image?: string | null | undefined;
  overallScore: number;
  isRecommended: boolean;
  price: number;
  currency: string;
  priceLabel: string;
  affiliateLink?: string | null;
  lastUpdated: string;
  status: ProductStatus;
  categoryId: string | null;
  brandId: string | null;
  category: Product['category'];
  brand: Product['brand'];
  ratings: Product['ratings'];
  keyHighlights: ProductKeyHighlight[];
  weaknesses: ProductWeakness[];
  beforePurchasePoints: ProductBeforePurchasePoint[];
  afterUsagePoints: ProductAfterUsagePoint[];
  pros: ProductPro[];
  cons: ProductCon[];
  quickVerdict: ProductQuickVerdict | null;
  quickVerdictTags: ProductQuickVerdictTag[];
  pricing: ProductPricing | null;
  finalVerdictPoints: ProductFinalVerdictPoint[];
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
      relations: [
        'category',
        'brand',
        'ratings',
        // 'keyHighlights',
        // 'weaknesses',
        // 'beforePurchasePoints',
        // 'afterUsagePoints',
        // 'pros',
        // 'cons',
        // 'quickVerdict',
        // 'quickVerdictTags',
        // 'pricing',
        // 'finalVerdictPoints',
      ],
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
      relations: [
        'category',
        'brand',
        'ratings',
        'keyHighlights',
        'weaknesses',
        'beforePurchasePoints',
        'afterUsagePoints',
        'pros',
        'cons',
        'quickVerdict',
        'quickVerdictTags',
        'pricing',
        'finalVerdictPoints',
      ],
    });

    if (!product) {
      throw new NotFoundException(
        `Published product with id "${id}" not found`,
      );
    }

    return this.toPublicProduct(product);
  }

  async findBySlug(slug: string): Promise<PublicProductResponse> {
    const product = await this.productRepository.findOne({
      where: { slug, status: ProductStatus.PUBLISHED },
      relations: [
        'category',
        'brand',
        'ratings',
        'keyHighlights',
        'weaknesses',
        'beforePurchasePoints',
        'afterUsagePoints',
        'pros',
        'cons',
        'quickVerdict',
        'quickVerdictTags',
        'pricing',
        'finalVerdictPoints',
      ],
    });

    if (!product) {
      throw new NotFoundException(
        `Published product with slug "${slug}" not found`,
      );
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
      ...product,
      // id: product.id,
      // name: product.name,
      // slug: product.slug,
      // subtitle: product.subtitle,
      // image: product.image ?? null,
      // overallScore: Number(product.overallScore),
      // isRecommended: product.isRecommended,
      // price: product.price,
      // currency: product.currency,
      // priceLabel: product.priceLabel,
      // affiliateLink: product.affiliateLink ?? null,
      // lastUpdated: product.lastUpdated,
      // status: product.status,
      // categoryId: product.categoryId,
      // brandId: product.brandId,
      // category: product.category,
      // brand: product.brand,
      // ratings: product.ratings,
      // keyHighlights: product.keyHighlights ?? [],
      // weaknesses: product.weaknesses ?? [],
      // beforePurchasePoints: product.beforePurchasePoints ?? [],
      // afterUsagePoints: product.afterUsagePoints ?? [],
      // pros: product.pros ?? [],
      // cons: product.cons ?? [],
      // quickVerdict: product.quickVerdict ?? null,
      // quickVerdictTags: product.quickVerdictTags ?? [],
      // pricing: product.pricing ?? null,
      // createdAt: product.createdAt,
      // updatedAt: product.updatedAt,
    };
  }
}
