import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ContentStatus, ContentType } from '../entities/content-article.entity';

export class ContentSectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  heading?: string | null;

  @IsString()
  body: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class ContentTagDto {
  @IsString()
  @MaxLength(120)
  value: string;
}

export class CreateContentArticleDto {
  @IsString()
  @MaxLength(180)
  slug: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  summary?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string | null;

  @IsEnum(ContentType)
  type: ContentType;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsDateString()
  publishedAt?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  isFeatured?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  heroImage?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  heroImageAlt?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentSectionDto)
  sections?: ContentSectionDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentTagDto)
  tags?: ContentTagDto[];
}
