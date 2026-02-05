import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { CollectionType } from '../entities/collection.entity';
export class CreateCollectionDto {
  /**
   * ประเภทบทความ (จำเป็น)
   * ใช้กำหนดรูปแบบการแสดงผล
   */
  @IsEnum(CollectionType)
  type: CollectionType;

  /**
   * slug สำหรับ URL และ SEO
   * ต้องไม่ซ้ำ
   */
  @IsString()
  @IsNotEmpty()
  slug: string;

  /**
   * ชื่อบทความภาษาไทย (จำเป็น)
   */
  @IsString()
  @IsNotEmpty()
  titleTh: string;

  /**
   * ชื่อบทความภาษาอังกฤษ (optional)
   */
  @IsOptional()
  @IsString()
  titleEn?: string;

  /**
   * ข้อความสั้นหน้า list
   */
  @IsOptional()
  @IsString()
  excerpt?: string;

  /**
   * รูปหน้าปก (URL)
   */
  @IsOptional()
  @IsString()
  coverImage?: string;

  /**
   * หมวดหลัก (optional)
   */
  @IsNotEmpty()
  categoryId?: string;
}
