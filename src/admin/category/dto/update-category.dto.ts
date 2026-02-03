import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  MinLength,
} from 'class-validator';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  @MinLength(2)
  nameTh: string;

  @IsString()
  @IsOptional() // field นี้ไม่บังคับ
  nameEn?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsOptional()
  orderIndex?: number;
}
