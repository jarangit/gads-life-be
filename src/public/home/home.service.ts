import { Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { IHomeResponse } from './dto/interface/response-home';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../admin/category/entities/category.entity';
import { Repository } from 'typeorm';
import { Product } from '../../admin/products/entities/product.entity';
import { Brand } from '../../admin/brands/entities/brand.entity';
import { Collection } from '../../admin/collection/entities/collection.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,

    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}
  create(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  async findAll(): Promise<IHomeResponse> {
    const categories = await this.categoryRepository.find();
    const topPickProduct = await this.productRepository.find({
      order: { updatedAt: 'DESC' },
      take: 5,
    });
    const lastReviewProduct = await this.productRepository.find({
      order: { updatedAt: 'DESC' },
      take: 5,
    });
    const topBrands = await this.brandRepository.find({
      order: { updatedAt: 'DESC' },
      take: 5,
    });

    // i want to find sell product by collection slug = 'sell-product'
    const sellProducts = await this.collectionRepository.findOne({
      where: { slug: 'shop-special-price' },
      relations: ['items', 'items.product'],
    });
    return {
      categories,
      topPicks: topPickProduct,
      lastReview: lastReviewProduct,
      topBrands,
      sellProducts:
        sellProducts?.items.map((item) => ({
          ...item.product,
          sellPrice: item.dealPrice,
        })) || [],
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
