import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicCategoriesService } from './public-categories.service';
import { FindPublicCategoriesDto } from './dto/find-public-categories.dto';

@Controller('public/categories')
export class PublicCategoriesController {
  constructor(
    private readonly publicCategoriesService: PublicCategoriesService,
  ) {}

  @Get()
  findAll(@Query() query: FindPublicCategoriesDto) {
    return this.publicCategoriesService.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.publicCategoriesService.findOne(slug);
  }
}
