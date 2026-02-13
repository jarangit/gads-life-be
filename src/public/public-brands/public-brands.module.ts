import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../../admin/brands/entities/brand.entity';
import { Product } from '../../admin/products/entities/product.entity';
import { PublicBrandsController } from './public-brands.controller';
import { PublicBrandsService } from './public-brands.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Product])],
  controllers: [PublicBrandsController],
  providers: [PublicBrandsService],
})
export class PublicBrandsModule {}
