import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Product } from '../products/entities/product.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Category } from '../category/entities/category.entity';
import { Collection } from '../collection/entities/collection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Brand, Category, Collection]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
