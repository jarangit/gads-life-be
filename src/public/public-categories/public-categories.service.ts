import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../admin/category/entities/category.entity';
import {
  buildPaginationOptions,
} from '../../common/dto/pagination-query.dto';
import { FindPublicCategoriesDto } from './dto/find-public-categories.dto';
import { Product } from '../../admin/products/entities/product.entity';
import { ProductStatus } from '../../admin/products/dto/validate.dto';
import { ICategoryProductsResponse } from './interface/response';
import { toPublicCategory } from './public-categories.mapper';
import { ICategoriesListResponse } from './interface/list-respoce';

@Injectable()
export class PublicCategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    query: FindPublicCategoriesDto,
  ): Promise<ICategoriesListResponse> {
    const { page, limit, skip } = buildPaginationOptions(query);

    const [categories, total] = await this.categoryRepository.findAndCount({
      where: { isActive: true },
      order: {
        orderIndex: 'ASC',
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });
    // find product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await this.productRepository.count({
          where: {
            category: { id: category.id },
            status: ProductStatus.PUBLISHED,
          },
        });
        return {
          ...category,
          productCount,
        };
      }),
    );

    return {
      items: categoriesWithCount,
      pagination: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string): Promise<ICategoryProductsResponse> {
    const category = await this.categoryRepository.findOne({
      where: { slug, isActive: true },
    });

    if (!category) {
      throw new NotFoundException(
        `Active category with slug "${slug}" not found`,
      );
    }

    const [products, productTotal] = await this.findPublishedProducts(
      category.id,
    );

    return toPublicCategory(category, products, {
      total: productTotal,
      page: 1,
      limit: productTotal,
      totalPages: 1,
    });
  }

  private findPublishedProducts(
    categoryId: string,
  ): Promise<[Product[], number]> {
    return this.productRepository.findAndCount({
      where: {
        category: { id: categoryId },
        status: ProductStatus.PUBLISHED,
      },
      relations: ['brand'],
      order: { createdAt: 'DESC' },
    });
  }
}
