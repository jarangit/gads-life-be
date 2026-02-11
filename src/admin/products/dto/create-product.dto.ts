import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductStatus } from './validate.dto';
export class CreateProductRatingDto {
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

  @IsString()
  @IsOptional()
  brandId?: string | null;
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
