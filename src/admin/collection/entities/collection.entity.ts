import { Category } from '../../category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { nanoid10 } from '../../../../src/utils/nanoid';

/**
 * ประเภทของบทความ
 * - TOP_LIST: บทความแนวจัดอันดับ เช่น Top 5 / Top 10
 * - GUIDE: บทความสอน / แนะนำการเลือกซื้อ
 * - COMPARISON: บทความเปรียบเทียบสินค้า
 */
export enum CollectionType {
  TOP_LIST = 'TOP_LIST',
  GUIDE = 'GUIDE',
  COMPARISON = 'COMPARISON',
}

/**
 * สถานะของบทความ
 * - DRAFT: ยังไม่เผยแพร่ (คนเขียน / admin เห็น)
 * - PUBLISHED: เผยแพร่แล้ว (user เห็น)
 * - ARCHIVED: เก็บไว้ ไม่แสดงหน้าเว็บ แต่ยังไม่ลบข้อมูล
 */
export enum CollectionStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Entity: Collections
 * แทนตารางบทความทั้งหมดในระบบ
 */
@Entity({ name: 'collections' })
/**
 * index สำหรับ query:
 * - list บทความตาม category
 * - filter เฉพาะ status = PUBLISHED
 * - sort / filter ด้วย published_at
 */
@Index('idx_collections_category_status_published', [
  'categoryId',
  'status',
  'publishedAt',
])
/**
 * index สำหรับกรณีบทความอยู่ใน subcategory
 * ใช้กับหน้า list เช่น /laptop/gaming
 */
@Index('idx_collections_subcategory_status_published', [
  'status',
  'publishedAt',
])
export class Collection {
  /**
   * Primary Key
   * ใช้เป็น id หลักภายในระบบ
   */
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }

  /**
   * ประเภทบทความ
   * ใช้กำหนด behavior หน้าเว็บ เช่น layout / component ที่ใช้ render
   */
  @Column({ type: 'enum', enum: CollectionType })
  type: CollectionType;

  /**
   * slug สำหรับ SEO และ routing
   * ต้อง unique เช่น:
   * /Collections/top-5-laptop-for-work
   */
  @Index('uq_collections_slug', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  slug: string;

  /**
   * ชื่อบทความภาษาไทย
   * ใช้เป็น main title
   */
  @Column({ type: 'varchar', length: 255 })
  titleTh: string;

  /**
   * ชื่อบทความภาษาอังกฤษ
   * optional (เผื่อรองรับ multi-language)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  titleEn?: string | null;

  /**
   * ข้อความสั้นสำหรับหน้า list / card
   * ไม่ใช่เนื้อหาหลักของบทความ
   */
  @Column({ type: 'text', nullable: true })
  excerpt?: string | null;

  /**
   * URL รูปหน้าปกบทความ
   * ใช้แสดง thumbnail / hero image
   */
  @Column({ type: 'varchar', length: 1024, nullable: true })
  coverImage?: string | null;

  /**
   * FK: category หลัก
   * nullable เพราะบางบทความอาจไม่อยู่ใน category
   */
  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
    name: 'category_id',
  })
  categoryId?: string | null;

  /**
   * relation ไปที่ Category
   * onDelete: SET NULL
   * → ถ้า category ถูกลบ บทความไม่หาย แต่แค่หลุดหมวด
   */
  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category | null;

  /**
   * สถานะบทความ
   * default = DRAFT
   * ป้องกันบทความใหม่หลุดขึ้น production โดยไม่ตั้งใจ
   */
  @Column({
    type: 'enum',
    enum: CollectionStatus,
    default: CollectionStatus.DRAFT,
    nullable: true,
  })
  status: CollectionStatus;

  /**
   * วันที่เผยแพร่จริง
   * ใช้ควบคุม:
   * - schedule publish
   * - sort หน้า list
   */
  @Column({
    type: 'datetime',
    nullable: true,
    name: 'published_at',
  })
  publishedAt?: Date | null;

  /**
   * วันที่สร้าง record
   * auto-managed โดย TypeORM
   */
  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  /**
   * วันที่แก้ไขล่าสุด
   * auto-update ทุกครั้งที่ save
   */
  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
