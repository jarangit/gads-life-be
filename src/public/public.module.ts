import { Module } from '@nestjs/common';
import { PublicProductsModule } from './public-products/public-products.module';
import { PublicCategoriesModule } from './public-categories/public-categories.module';
import { PublicBrandsModule } from './public-brands/public-brands.module';
import { PublicCollectionsModule } from './public-collections/public-collections.module';

@Module({
  imports: [
    PublicProductsModule,
    PublicCategoriesModule,
    PublicBrandsModule,
    PublicCollectionsModule,
  ],
})
export class PublicModule {}
