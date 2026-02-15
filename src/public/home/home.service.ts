import { Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { IHomeResponse } from './dto/interface/response-home';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../admin/category/entities/category.entity';
import { Repository } from 'typeorm';
import { Product } from '../../admin/products/entities/product.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  create(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  async findAll(): Promise<IHomeResponse> {
    const categories = await this.categoryRepository.find();
    const products = await this.productRepository.find({
      where: { isRecommended: true },
      order: { updatedAt: 'DESC' },
      take: 10,
    });
    return {
      categories,
      topPicks: products.map((p) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        image: p.image ?? null,
        overallScore: p.overallScore,
        isRecommended: p.isRecommended,
        price: p.price,
        currency: p.currency,
        priceLabel: p.priceLabel,
        affiliateLink: p.affiliateLink ?? null,
        lastUpdated: p.updatedAt.toISOString(),
        status: p.status,
        categoryId: p.categoryId,
        brandId: p.brandId,
        category: p.category,
        brand: p.brand,
        ratings: p.ratings,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} home`;
  }

  update(id: number, updateHomeDto: UpdateHomeDto) {
    return `This action updates a #${id} home`;
  }

  remove(id: number) {
    return `This action removes a #${id} home`;
  }
}
