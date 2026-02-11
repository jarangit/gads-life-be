import {
  Entity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductRating } from './product-rating.entity';
import { nanoid10 } from '../../../utils/nanoid';
import { Category } from './../../category/entities/category.entity';
import { ProductStatus } from '../dto/validate.dto';
import { Brand } from '../../brands/entities/brand.entity';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }

  // categoryId: string; // FK ไป categories.id (ถ้ามีหลายหมวด อาจต้องทำเป็น many-to-many)
  @Column({ type: 'varchar', length: 10, name: 'category_id', nullable: true })
  categoryId: string | null;

  // category relation
  @ManyToOne(() => Category, (c) => c.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  brandId: string | null;

  // brand relation
  @ManyToOne(() => Brand, (b) => b.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand | null;

  /** ชื่อสินค้า */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /** คำโปรยใต้ชื่อ */
  @Column({ type: 'varchar', length: 500 })
  subtitle: string;

  /** URL รูปหลัก (nullable เพราะบางทีใช้ CDN ทีหลัง) */
  @Column({ type: 'varchar', length: 1024, nullable: true })
  image?: string | null;

  /** คะแนนรวม (เช่น 4.1) */
  @Column({ type: 'decimal', precision: 3, scale: 1 })
  overallScore: number;

  /** recommended badge */
  @Column({ type: 'boolean', default: false })
  isRecommended: boolean;

  /** ราคา */
  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'THB' })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  priceLabel: string;

  /** ลิงก์ affiliate (ถ้ายังไม่มี ให้เป็น null) */
  @Column({ type: 'varchar', length: 1024, nullable: true })
  affiliateLink?: string | null;

  /**
   * lastUpdated จาก JSON เป็นวันที่ (ไม่จำเป็นต้องใช้ createdAt/updatedAt แทน)
   * เก็บเป็น date จะเหมาะกว่า datetime
   */
  @Column({ type: 'date' })
  lastUpdated: string;

  /** timestamps ของ DB record */
  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  // ========================================
  // Relations
  // ========================================
  /** ratings[] */
  @OneToMany(() => ProductRating, (x) => x.product, { cascade: true })
  ratings: ProductRating[];

  // @OneToMany(() => ProductQuickVerdict, (pqv) => pqv.product, {
  //   cascade: true,
  //   eager: true,
  // })
  // @JoinColumn({ name: 'quick_verdict_id' })
  // quickVerdict: ProductQuickVerdict;

  @Column({
    type: 'varchar',
    length: 20,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;
}
