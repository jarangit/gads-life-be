import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicProductsService } from './public-products.service';
import { FindPublicProductsDto } from './dto/find-public-products.dto';

@Controller('public/products')
export class PublicProductsController {
  constructor(private readonly publicProductsService: PublicProductsService) {}

  @Get()
  findAll(@Query() query: FindPublicProductsDto) {
    return this.publicProductsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicProductsService.findOne(id);
  }
}
