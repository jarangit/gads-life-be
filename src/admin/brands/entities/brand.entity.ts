import { nanoid10 } from '../../..//utils/nanoid';
import { Product } from '../../products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
// ปรับ path import ให้ตรงโปรเจกต์คุณ

@Entity('brands')
@Index('uq_brands_slug', ['slug'], { unique: true })
@Index('uq_brands_name', ['name'], { unique: true })
export class Brand {
  /**
   * PK ภายในระบบ
   */
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }
  /**
   * ชื่อแบรนด์ (แสดงผลหลัก)
   * เช่น "Apple", "Anker"
   */
  @Column({ type: 'varchar', length: 120 })
  name: string;

  /**
   * slug สำหรับ URL/SEO
   * เช่น "apple", "anker"
   * URL ตัวอย่าง: /brands/apple
   */
  @Column({ type: 'varchar', length: 140 })
  slug: string;

  /**
   * คำอธิบายสั้น (สำหรับหน้า list/card)
   */
  @Column({ type: 'varchar', length: 300, nullable: true })
  tagline?: string | null;

  /**
   * รายละเอียดแบรนด์ (สำหรับหน้า brand detail)
   * จะเอาไปทำ SEO content ได้
   */
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  /**
   * โลโก้แบรนด์ (URL)
   */
  @Column({ type: 'varchar', length: 1024, nullable: true })
  logoUrl?: string | null;

  /**
   * รูปสำหรับแชร์/หน้าแบรนด์ (Open Graph)
   */
  @Column({ type: 'varchar', length: 1024, nullable: true })
  ogImageUrl?: string | null;

  // ---------------- SEO ----------------

  /**
   * <title> ของหน้าแบรนด์
   * ถ้าไม่ใส่ ให้ fallback เป็น `${name} | Gads Life`
   */
  @Column({ type: 'varchar', length: 70, nullable: true })
  metaTitle?: string | null;

  /**
   * meta description (ควร 120-160 chars)
   * ถ้าไม่ใส่ ให้ fallback จาก tagline/description
   */
  @Column({ type: 'varchar', length: 170, nullable: true })
  metaDescription?: string | null;

  /**
   * canonical URL (ใช้กันปัญหา duplicate content)
   * เก็บเป็น path หรือ full URL ก็ได้
   * เช่น "/brands/apple"
   */
  @Column({ type: 'varchar', length: 1024, nullable: true })
  canonicalUrl?: string | null;

  /**
   * robots meta
   * - index/follow = ปกติ
   * - noindex = ไม่อยากให้ติด google (เช่นหน้าแบรนด์ยังไม่พร้อม)
   */
  @Column({ type: 'boolean', default: true })
  isIndexable: boolean;

  @Column({ type: 'boolean', default: true })
  isFollowable: boolean;

  /**
   * structured data (JSON-LD) เผื่ออยากใส่ข้อมูลเพิ่มภายหลัง
   * เช่น sameAs social links, brand info
   */
  @Column({ type: 'json', nullable: true })
  schemaJsonLd?: Record<string, any> | null;

  // ------------- Relations -------------

  /**
   * 1 Brand มีหลาย Products
   * (คุณจะทำ query brand ใน category ผ่าน product ได้)
   */
  @OneToMany(() => Product, (p) => p.brand)
  products: Product[];

  // ------------- timestamps ------------

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
