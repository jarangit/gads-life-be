import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicContentArticlesService } from './public-content-articles.service';
import { PublicContentArticlesController } from './public-content-articles.controller';
import { ContentArticle } from '../../admin/content-articles/entities/content-article.entity';
import { ContentSection } from '../../admin/content-articles/entities/content-section.entity';
import { ContentTag } from '../../admin/content-articles/entities/content-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentArticle, ContentSection, ContentTag]),
  ],
  controllers: [PublicContentArticlesController],
  providers: [PublicContentArticlesService],
})
export class PublicContentArticlesModule {}
