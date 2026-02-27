import { Module } from '@nestjs/common';
import { PublicProductsModule } from './public-products/public-products.module';
import { PublicCategoriesModule } from './public-categories/public-categories.module';
import { PublicBrandsModule } from './public-brands/public-brands.module';
import { PublicCollectionsModule } from './public-collections/public-collections.module';
import { HomeModule } from './home/home.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PublicContentArticlesModule } from './public-content-articles/public-content-articles.module';
import { PublicFeedbackRequestsModule } from './public-feedback-requests/public-feedback-requests.module';

@Module({
  imports: [
    PublicProductsModule,
    PublicCategoriesModule,
    PublicBrandsModule,
    PublicCollectionsModule,
    HomeModule,
    AnalyticsModule,
    PublicContentArticlesModule,
    PublicFeedbackRequestsModule,
  ],
})
export class PublicModule {}
