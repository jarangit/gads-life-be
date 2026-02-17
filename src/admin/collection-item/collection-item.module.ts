import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionItemService } from './collection-item.service';
import { CollectionItemController } from './collection-item.controller';
import { CollectionItem } from './entities/collection-item.entity';
import { Collection } from '../collection/entities/collection.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionItem, Collection, Product])],
  controllers: [CollectionItemController],
  providers: [CollectionItemService],
})
export class CollectionItemModule {}
