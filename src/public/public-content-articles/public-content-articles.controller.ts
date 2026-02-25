import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PublicContentArticlesService } from './public-content-articles.service';
import { FindPublicContentArticlesDto } from './dto/find-public-content-articles.dto';

@Controller('/public/content-articles')
export class PublicContentArticlesController {
  constructor(
    private readonly publicContentArticlesService: PublicContentArticlesService,
  ) {}

  @Get()
  findAll(@Query() query: FindPublicContentArticlesDto) {
    return this.publicContentArticlesService.findAll(query);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.publicContentArticlesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.publicContentArticlesService.findOne(id);
  }
}
