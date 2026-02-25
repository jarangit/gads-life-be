import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { ContentType } from '../../../admin/content-articles/entities/content-article.entity';

export const PUBLIC_CONTENT_ARTICLE_SORT_VALUES = ['latest', 'oldest'] as const;

export type PublicContentArticleSort =
  (typeof PUBLIC_CONTENT_ARTICLE_SORT_VALUES)[number];

export class FindPublicContentArticlesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  isFeatured?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  tag?: string;

  @IsOptional()
  @IsIn(PUBLIC_CONTENT_ARTICLE_SORT_VALUES)
  sort?: PublicContentArticleSort;
}
