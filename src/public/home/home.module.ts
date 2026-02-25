import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { Category } from '../../admin/category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../admin/products/entities/product.entity';
import { Brand } from '../../admin/brands/entities/brand.entity';
import { Collection } from '../../admin/collection/entities/collection.entity';
import { ContentArticle } from '../../admin/content-articles/entities/content-article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Brand, Collection, ContentArticle])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
