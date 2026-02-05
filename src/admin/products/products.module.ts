import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRating } from './entities/product-rating.entiry';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductRating])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
