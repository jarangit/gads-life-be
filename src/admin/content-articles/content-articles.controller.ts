import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContentArticlesService } from './content-articles.service';
import { CreateContentArticleDto } from './dto/create-content-article.dto';
import { UpdateContentArticleDto } from './dto/update-content-article.dto';
import { FindContentArticleQueryDto } from './dto/find-content-article.dto';
import { AdminOnly } from '../../common/decorators/admin-only.decorator';

@Controller('admin/content-articles')
@AdminOnly()
export class ContentArticlesController {
  constructor(private readonly contentArticlesService: ContentArticlesService) {}

  @Post()
  create(@Body() dto: CreateContentArticleDto) {
    return this.contentArticlesService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindContentArticleQueryDto) {
    return this.contentArticlesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentArticlesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContentArticleDto,
  ) {
    return this.contentArticlesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentArticlesService.remove(id);
  }

  @Delete(':id/tags/:tagId')
  removeTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
  ) {
    return this.contentArticlesService.removeTag(id, tagId);
  }
}
