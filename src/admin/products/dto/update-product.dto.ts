import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { CreateProductRatingDto } from './create-product.dto';
import { Type } from 'class-transformer';
import { ProductStatus } from './validate.dto';

export class UpdateProductDto extends PartialType(CreateProductRatingDto) {
  /** เช่น "ความคุ้มค่า" */
  @IsString()
  @IsNotEmpty()
  subCategory: string;

  /** คะแนน 1-5 */
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}

export class CreateProductDto {
  @IsString()
  @IsOptional()
  categoryId?: string | null;

  /** ชื่อสินค้า */
  @IsString()
  @IsNotEmpty()
  name: string;

  /** คำโปรยใต้ชื่อ */
  @IsString()
  @IsNotEmpty()
  subtitle: string;

  /** URL รูปหลัก */
  @IsOptional()
  @IsString()
  image?: string | null;

  /** คะแนนรวม (เช่น 4.1) */
  @IsNumber()
  @Min(0)
  @Max(5)
  overallScore: number;

  /** recommended badge (ถ้าไม่ส่งมา = false) */
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;

  /** ราคา */
  @IsInt()
  @Min(0)
  price: number;

  /** currency (default THB ถ้าไม่ส่งมา) */
  @IsOptional()
  @IsString()
  currency?: string;

  /** label ราคา */
  @IsString()
  @IsNotEmpty()
  priceLabel: string;

  /** ลิงก์ affiliate */
  @IsOptional()
  @IsString()
  affiliateLink?: string | null;

  /** วันที่อัปเดตล่าสุด (YYYY-MM-DD) */
  @IsDateString()
  lastUpdated: string;

  /** ratings[] (optional) */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductRatingDto)
  ratings?: CreateProductRatingDto[];

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
