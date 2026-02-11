import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRating } from './entities/product-rating.entity';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductRating, Category, Brand]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
