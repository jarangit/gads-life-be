import { PartialType } from '@nestjs/mapped-types';
import {
  ContentSectionDto,
  ContentTagDto,
  CreateContentArticleDto,
} from './create-content-article.dto';

export class UpdateContentArticleDto extends PartialType(
  CreateContentArticleDto,
) {
  sections?: ContentSectionDto[];
  tags?: ContentTagDto[];
}
