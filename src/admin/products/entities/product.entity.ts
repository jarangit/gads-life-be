import {
  Entity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductRating } from './product-rating.entity';
import { nanoid10 } from '../../../utils/nanoid';
import { slugify } from '../../../utils/slugify';
import { Category } from './../../category/entities/category.entity';
import { ProductStatus } from '../dto/validate.dto';
import { Brand } from '../../brands/entities/brand.entity';
import { ProductKeyHighlight } from './product-key-highlight.entity';
import { ProductWeakness } from './product-weakness.entity';
import { ProductBeforePurchasePoint } from './product-before-purchase-point.entity';
import { ProductAfterUsagePoint } from './product-after-usage-point.entity';
import { ProductPro } from './product-pro.entity';
import { ProductCon } from './product-con.entity';
import { ProductQuickVerdict } from './product-quick-verdict.entity';
import { ProductQuickVerdictTag } from './product-quick-verdict-tag.entity';
import { ProductPricing } from './product-pricing.entity';
import { ProductFinalVerdictPoint } from './product-final-verdict-point.entity';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
    if (!this.slug && this.name) {
      this.slug = slugify(this.name);
    }
  }

  /** URL-friendly slug (auto-generated from name, editable) */
  @Column({ type: 'varchar', length: 500, nullable: true })
  slug?: string;

  // categoryId: string; // FK ไป categories.id (ถ้ามีหลายหมวด อาจต้องทำเป็น many-to-many)
  @Column({ type: 'varchar', length: 10, name: 'category_id', nullable: true })
  categoryId: string | null;

  // category relation
  @ManyToOne(() => Category, (c) => c.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @Column({ type: 'varchar', length: 10, name: 'brand_id', nullable: true })
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

  /** key highlights */
  @OneToMany(() => ProductKeyHighlight, (x) => x.product, { cascade: true })
  keyHighlights: ProductKeyHighlight[];

  /** weaknesses */
  @OneToMany(() => ProductWeakness, (x) => x.product, { cascade: true })
  weaknesses: ProductWeakness[];

  /** before purchase points */
  @OneToMany(() => ProductBeforePurchasePoint, (x) => x.product, {
    cascade: true,
  })
  beforePurchasePoints: ProductBeforePurchasePoint[];

  /** after usage points */
  @OneToMany(() => ProductAfterUsagePoint, (x) => x.product, { cascade: true })
  afterUsagePoints: ProductAfterUsagePoint[];

  /** pros */
  @OneToMany(() => ProductPro, (x) => x.product, { cascade: true })
  pros: ProductPro[];

  /** cons */
  @OneToMany(() => ProductCon, (x) => x.product, { cascade: true })
  cons: ProductCon[];

  /** quick verdict (1:1) */
  @OneToOne(() => ProductQuickVerdict, (x) => x.product, { cascade: true })
  quickVerdict: ProductQuickVerdict;

  /** quick verdict tags */
  @OneToMany(() => ProductQuickVerdictTag, (x) => x.product, { cascade: true })
  quickVerdictTags: ProductQuickVerdictTag[];

  /** pricing (1:1) */
  @OneToOne(() => ProductPricing, (x) => x.product, { cascade: true })
  pricing: ProductPricing;

  /** final verdict points (buy_if / skip_if) */
  @OneToMany(() => ProductFinalVerdictPoint, (x) => x.product, { cascade: true })
  finalVerdictPoints: ProductFinalVerdictPoint[];

  @Column({
    type: 'varchar',
    length: 20,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;
}
