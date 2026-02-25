import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentArticlesService } from './content-articles.service';
import { ContentArticlesController } from './content-articles.controller';
import { ContentArticle } from './entities/content-article.entity';
import { ContentSection } from './entities/content-section.entity';
import { ContentTag } from './entities/content-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentArticle, ContentSection, ContentTag])],
  controllers: [ContentArticlesController],
  providers: [ContentArticlesService],
})
export class ContentArticlesModule {}
