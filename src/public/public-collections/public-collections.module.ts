import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../../admin/collection/entities/collection.entity';
import { PublicCollectionsController } from './public-collections.controller';
import { PublicCollectionsService } from './public-collections.service';
import { Product } from 'src/admin/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Product])],
  controllers: [PublicCollectionsController],
  providers: [PublicCollectionsService],
})
export class PublicCollectionsModule {}
