import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../../admin/collection/entities/collection.entity';
import { PublicCollectionsController } from './public-collections.controller';
import { PublicCollectionsService } from './public-collections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  controllers: [PublicCollectionsController],
  providers: [PublicCollectionsService],
})
export class PublicCollectionsModule {}
