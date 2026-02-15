import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { Category } from '../../admin/category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../admin/products/entities/product.entity';
import { Brand } from '../../admin/brands/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Brand])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
