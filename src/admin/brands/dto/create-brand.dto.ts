export class CreateBrandDto {
  /** ชื่อแบรนด์ (แสดงผลหลัก) */
  name: string;

  /** slug สำหรับ URL/SEO */
  slug: string;

  /** คำอธิบายสั้น (สำหรับหน้า list/card) */
  tagline?: string | null;

  /** รายละเอียดแบรนด์ (สำหรับหน้า brand detail) จะเอาไปทำ SEO content ได้ */
  description?: string | null;

  /** โลโก้แบรนด์ (URL) */
  logoUrl?: string | null;

  /** รูปสำหรับแชร์/หน้าแบรนด์ (Open Graph) */
  ogImageUrl?: string | null;

  metaTitle?: string | null;

  metaDescription?: string | null;

  canonicalUrl?: string | null;
}
