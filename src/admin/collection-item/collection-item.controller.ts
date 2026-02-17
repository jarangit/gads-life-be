import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CollectionItemService } from './collection-item.service';
import { CreateCollectionItemDto } from './dto/create-collection-item.dto';
import { UpdateCollectionItemDto } from './dto/update-collection-item.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Controller('/admin/collection-items')
export class CollectionItemController {
  constructor(private readonly collectionItemService: CollectionItemService) {}

  @Post()
  create(@Body() createCollectionItemDto: CreateCollectionItemDto) {
    return this.collectionItemService.create(createCollectionItemDto);
  }

  @Get('')
  findAll(
    @Param('collectionId') collectionId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.collectionItemService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionItemService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionItemDto: UpdateCollectionItemDto,
  ) {
    return this.collectionItemService.update(id, updateCollectionItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionItemService.remove(id);
  }
}
