import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../admin/category/entities/category.entity';
import { PublicCategoriesController } from './public-categories.controller';
import { PublicCategoriesService } from './public-categories.service';
import { Product } from '../../admin/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [PublicCategoriesController],
  providers: [PublicCategoriesService],
})
export class PublicCategoriesModule {}
