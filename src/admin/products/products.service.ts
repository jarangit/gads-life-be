import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRating } from './entities/product-rating.entiry';

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
    const created = this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);
      const ratingRepo = manager.getRepository(ProductRating);

      // create product first
      const product = productRepo.create({
        ...createProductDto,
      });
      // map ratings
      if (createProductDto.ratings && createProductDto.ratings.length > 0) {
        const ratings = createProductDto.ratings.map((r) =>
          ratingRepo.create({
            productId: product.id,
            subCategory: r.subCategory,
            score: r.score,
          }),
        );
        await ratingRepo.save(ratings);
      } else {
        product.ratings = [];
      }
      return await productRepo.save(product);
    });
    return created;
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
