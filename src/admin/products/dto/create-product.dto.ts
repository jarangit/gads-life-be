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

// ─── Nested DTOs ────────────────────────────────────────

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

/** DTO สำหรับ list-item ที่มี content + sortOrder */
export class CreateSortedContentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateQuickVerdictDto {
  @IsString()
  @IsNotEmpty()
  quote: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateQuickVerdictTagDto {
  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateProductPricingDto {
  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  priceLabel: string;
}

// ─── Main DTO ───────────────────────────────────────────

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

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  // ─── Relations (all optional) ───

  /** ratings[] */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductRatingDto)
  ratings?: CreateProductRatingDto[];

  /** จุดเด่น */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSortedContentDto)
  keyHighlights?: CreateSortedContentDto[];

  /** จุดอ่อน */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSortedContentDto)
  weaknesses?: CreateSortedContentDto[];

  /** สิ่งที่ควรรู้ก่อนซื้อ */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSortedContentDto)
  beforePurchasePoints?: CreateSortedContentDto[];

  /** ข้อสังเกตหลังใช้งาน */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSortedContentDto)
  afterUsagePoints?: CreateSortedContentDto[];

  /** ข้อดี */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSortedContentDto)
  pros?: CreateSortedContentDto[];

  /** ข้อเสีย */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSortedContentDto)
  cons?: CreateSortedContentDto[];

  /** Quick Verdict (1:1) */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateQuickVerdictDto)
  quickVerdict?: CreateQuickVerdictDto;

  /** Quick Verdict Tags */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuickVerdictTagDto)
  quickVerdictTags?: CreateQuickVerdictTagDto[];

  /** Pricing (1:1) */
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProductPricingDto)
  pricing?: CreateProductPricingDto;
}
