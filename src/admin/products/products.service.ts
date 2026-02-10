import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRating } from './entities/product-rating.entity';
import { FindProductQueryDto } from './dto/validate.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductRating)
    private readonly productRatingRepository: Repository<ProductRating>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
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
      relations: ['category', 'ratings'],
    });
    const total = products.length;
    const data = { items: products, total };
    return data;
  }

  findOne(id: string) {
    const product = this.productRepository.findOne({
      where: { id },
      relations: ['category', 'ratings'],
    });
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);

      const { ...productData } = updateProductDto;

      await productRepo.update(id, productData as Partial<Product>);

      return productRepo.findOne({
        where: { id: id.toString() },
        relations: ['category', 'ratings'],
      });
    });
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
