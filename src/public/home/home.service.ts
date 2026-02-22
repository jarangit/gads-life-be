import { Injectable } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import {
  IHomeResponse,
  IQuickVerdictProductItem,
} from './dto/interface/response-home';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../admin/category/entities/category.entity';
import { Repository } from 'typeorm';
import { Product } from '../../admin/products/entities/product.entity';
import { Brand } from '../../admin/brands/entities/brand.entity';
import { Collection } from '../../admin/collection/entities/collection.entity';
import { ProductStatus } from '../../admin/products/dto/validate.dto';

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

    // fetch random products that have quickVerdict (for "what is this product" section)
    const quickVerdictProducts = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.quickVerdict', 'quickVerdict')
      .where('product.status = :status', { status: ProductStatus.PUBLISHED })
      .orderBy('RAND()')
      .take(5)
      .getMany();

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
      quickVerdictProducts: quickVerdictProducts.map(
        (p): IQuickVerdictProductItem => ({
          id: p.id,
          slug: p.slug ?? null,
          name: p.name,
          quickVerdict: p.quickVerdict.quote,
        }),
      ),
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
