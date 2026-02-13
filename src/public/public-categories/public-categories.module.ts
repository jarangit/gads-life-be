import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../admin/category/entities/category.entity';
import { PublicCategoriesController } from './public-categories.controller';
import { PublicCategoriesService } from './public-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [PublicCategoriesController],
  providers: [PublicCategoriesService],
})
export class PublicCategoriesModule {}
