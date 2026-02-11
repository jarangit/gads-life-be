import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRating } from './entities/product-rating.entity';
import { FindProductQueryDto } from './dto/validate.dto';
import { Category } from '../category/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductRating)
    private readonly productRatingRepository: Repository<ProductRating>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validate categoryId exists
    if (createProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });
      if (!category) {
        throw new BadRequestException(
          `Category with id "${createProductDto.categoryId}" not found`,
        );
      }
    }

    // Validate brandId exists
    if (createProductDto.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: createProductDto.brandId },
      });
      if (!brand) {
        throw new BadRequestException(
          `Brand with id "${createProductDto.brandId}" not found`,
        );
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);
      const ratingRepo = manager.getRepository(ProductRating);

      // แยก ratings ออกก่อน เพื่อไม่ให้ cascade save ซ้ำ
      const { ratings: ratingsDto, ...productData } = createProductDto;

      const product = productRepo.create(productData);
      await productRepo.save(product);

      // create ratings manually
      if ((ratingsDto ?? []).length > 0) {
        const ratings = ratingsDto!.map((r) =>
          ratingRepo.create({
            productId: product.id,
            subCategory: r.subCategory,
            score: r.score,
          }),
        );
        await ratingRepo.save(ratings);
      }

      return product;
    });
  }

  async findAll(q: FindProductQueryDto): Promise<{
    items: Product[];
    total: number;
  }> {
    // Loop through query object และเพิ่มเฉพาะ field ที่มีค่า
    const where: Record<string, unknown> = {};
    if (q) {
      Object.entries(q).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          where[key] = value;
        }
      });
    }

    const products = await this.productRepository.find({
      where,
      relations: ['category', 'ratings', 'brand'],
    });
    const total = products.length;
    const data = { items: products, total };
    return data;
  }

  findOne(id: string) {
    const product = this.productRepository.findOne({
      where: { id },
      relations: ['category', 'ratings', 'brand'],
    });
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Validate categoryId exists
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new BadRequestException(
          `Category with id "${updateProductDto.categoryId}" not found`,
        );
      }
    }

    // Validate brandId exists
    if (updateProductDto.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: updateProductDto.brandId },
      });
      if (!brand) {
        throw new BadRequestException(
          `Brand with id "${updateProductDto.brandId}" not found`,
        );
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);
      const ratingRepo = manager.getRepository(ProductRating);

      // Exclude ratings from product update data
      const { ratings: ratingsDto, ...productData } = updateProductDto;

      await productRepo.update(id, productData as Partial<Product>);

      // Update ratings if provided
      if (ratingsDto && ratingsDto.length > 0) {
        // Delete existing ratings
        await ratingRepo.delete({ productId: id });

        // Create new ratings
        const ratings = ratingsDto.map((r) =>
          ratingRepo.create({
            productId: id,
            subCategory: r.subCategory,
            score: r.score,
          }),
        );
        await ratingRepo.save(ratings);
      }

      return productRepo.findOne({
        where: { id: id.toString() },
        relations: ['category', 'ratings', 'brand'],
      });
    });
  }

  remove(id: string) {
    return this.productRepository.delete(id);
  }
}
