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
import {
  ContentArticle,
  ContentStatus,
} from '../../admin/content-articles/entities/content-article.entity';
import { IFeaturedArticleItem } from './dto/interface/response-home';

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

    @InjectRepository(ContentArticle)
    private contentArticleRepository: Repository<ContentArticle>,
  ) {}
  create(createHomeDto: CreateHomeDto) {
    return 'This action adds a new home';
  }

  async findAll(): Promise<IHomeResponse> {
    const [
      categories,
      topPicks,
      lastReview,
      topBrands,
      sellProducts,
      quickVerdictProducts,
      featuredArticles,
    ] = await Promise.all([
      this.getCategories(),
      this.getTopPickProducts(),
      this.getLastReviewProducts(),
      this.getTopBrands(),
      this.getSellProducts(),
      this.getQuickVerdictProducts(),
      this.getFeaturedArticles(),
    ]);

    return {
      categories,
      topPicks,
      lastReview,
      topBrands,
      sellProducts,
      quickVerdictProducts,
      featuredArticles,
    };
  }

  private async getCategories() {
    return this.categoryRepository.find();
  }

  private async getTopPickProducts() {
    return this.productRepository.find({
      order: { updatedAt: 'DESC' },
      take: 5,
    });
  }

  private async getLastReviewProducts() {
    return this.productRepository.find({
      order: { updatedAt: 'DESC' },
      take: 5,
    });
  }

  private async getTopBrands() {
    return this.brandRepository.find({
      order: { updatedAt: 'DESC' },
      take: 5,
    });
  }

  private async getSellProducts(): Promise<Product[]> {
    const collections = await this.collectionRepository.find({
      where: { slug: 'shop-special-price' },
      relations: ['items', 'items.product'],
    });
    return collections.length > 0
      ? collections[0].items.slice(0, 5).map((item) => item.product)
      : [];
  }

  private async getQuickVerdictProducts(): Promise<IQuickVerdictProductItem[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.quickVerdict', 'quickVerdict')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.status = :status', { status: ProductStatus.PUBLISHED })
      .orderBy('RAND()')
      .take(5)
      .getMany();

    return products.map((p) => ({
      id: p.id,
      slug: p.slug ?? null,
      name: p.name,
      quickVerdict: p.quickVerdict.quote,
      categoryName: p.category ? p.category.nameTh : null,
    }));
  }

  private async getFeaturedArticles(): Promise<IFeaturedArticleItem[]> {
    const articles = await this.contentArticleRepository.find({
      where: { isFeatured: 1, status: ContentStatus.PUBLISHED },
      order: { publishedAt: 'DESC' },
      take: 5,
      select: [
        'id',
        'slug',
        'title',
        'excerpt',
        'heroImage',
        'heroImageAlt',
        'type',
        'publishedAt',
      ],
    });

    return articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt ?? null,
      heroImage: a.heroImage ?? null,
      heroImageAlt: a.heroImageAlt ?? null,
      type: a.type,
      publishedAt: a.publishedAt ?? null,
    }));
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
