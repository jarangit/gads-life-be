import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicBrandsService } from './public-brands.service';
import { FindPublicBrandsDto } from './dto/find-public-brands.dto';

@Controller('public/brands')
export class PublicBrandsController {
  constructor(private readonly publicBrandsService: PublicBrandsService) {}

  @Get()
  findAll(@Query() query: FindPublicBrandsDto) {
    return this.publicBrandsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicBrandsService.findOne(id);
  }
}
