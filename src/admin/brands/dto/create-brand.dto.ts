import { IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  /** ชื่อแบรนด์ (แสดงผลหลัก) */
  @IsString()
  name: string;

  /** slug สำหรับ URL/SEO */
  @IsString()
  slug: string;

  /** คำอธิบายสั้น (สำหรับหน้า list/card) */
  @IsString()
  @IsOptional()
  tagline?: string | null;

  /** รายละเอียดแบรนด์ (สำหรับหน้า brand detail) จะเอาไปทำ SEO content ได้ */
  @IsString()
  @IsOptional()
  description?: string | null;

  /** โลโก้แบรนด์ (URL) */
  @IsString()
  @IsOptional()
  logoUrl?: string | null;

  /** รูปสำหรับแชร์/หน้าแบรนด์ (Open Graph) */
  @IsString()
  @IsOptional()
  ogImageUrl?: string | null;

  @IsString()
  @IsOptional()
  metaTitle?: string | null;

  @IsString()
  @IsOptional()
  metaDescription?: string | null;

  @IsString()
  @IsOptional()
  canonicalUrl?: string | null;
}
