import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../admin/category/entities/category.entity';
import {
  buildPaginationOptions,
  buildPaginationResult,
  PaginationResult,
} from '../../common/dto/pagination-query.dto';
import { FindPublicCategoriesDto } from './dto/find-public-categories.dto';

export type PublicCategoryResponse = {
  id: string;
  slug: string;
  nameTh: string;
  nameEn: string | null;
  description: string | null;
  heroImage: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PublicCategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    query: FindPublicCategoriesDto,
  ): Promise<PaginationResult<PublicCategoryResponse>> {
    const { page, limit, skip } = buildPaginationOptions(query);

    const [items, total] = await this.categoryRepository.findAndCount({
      where: { isActive: true },
      order: {
        orderIndex: 'ASC',
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    return buildPaginationResult({
      items: items.map((item) => this.toPublicCategory(item)),
      total,
      page,
      limit,
    });
  }

  async findOne(slug: string): Promise<PublicCategoryResponse> {
    const category = await this.categoryRepository.findOne({
      where: { slug, isActive: true },
    });

    if (!category) {
      throw new NotFoundException(`Active category with slug "${slug}" not found`);
    }

    return this.toPublicCategory(category);
  }

  private toPublicCategory(category: Category): PublicCategoryResponse {
    return {
      id: category.id,
      slug: category.slug,
      nameTh: category.nameTh,
      nameEn: category.nameEn,
      description: category.description,
      heroImage: category.heroImage,
      isActive: category.isActive,
      orderIndex: category.orderIndex,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
