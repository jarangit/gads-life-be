import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './admin/category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionModule } from './admin/collection/collection.module';
import { ProductsModule } from './admin/products/products.module';
import { BrandsModule } from './admin/brands/brands.module';
import { PublicModule } from './public/public.module';
import { ProductDetailsModule } from './admin/products/product-details.module';
import { CollectionItemModule } from './admin/collection-item/collection-item.module';
import { ReportsModule } from './admin/reports/reports.module';
import { ContentArticlesModule } from './admin/content-articles/content-articles.module';
import { FeedbackRequestsModule } from './admin/feedback-requests/feedback-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    CategoryModule,
    CollectionModule,
    ProductsModule,
    ProductDetailsModule,
    BrandsModule,
    PublicModule,
    CollectionItemModule,
    ReportsModule,
    ContentArticlesModule,
    FeedbackRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
