import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicCollectionsService } from './public-collections.service';
import { FindPublicCollectionsDto } from './dto/find-public-collections.dto';

@Controller('public/collections')
export class PublicCollectionsController {
  constructor(
    private readonly publicCollectionsService: PublicCollectionsService,
  ) {}

  @Get()
  findAll(@Query() query: FindPublicCollectionsDto) {
    return this.publicCollectionsService.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.publicCollectionsService.findOne(slug);
  }
}
