import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { Collection } from '../../collection/entities/collection.entity';
import { Product } from '../../products/entities/product.entity';
import { nanoid10 } from 'src/utils/nanoid';

@Entity('collection_items')
@Index('idx_collection_order', ['collectionId', 'orderIndex'])
@Index('uq_collection_product', ['collectionId', 'productId'], { unique: true })
export class CollectionItem {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }

  // -------------------------
  // Relations
  // -------------------------

  @Column({ name: 'collection_id' })
  collectionId: string;

  @ManyToOne(() => Collection, (collection) => collection.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;

  @Column({ name: 'product_id', type: 'varchar', length: 50 })
  productId: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // -------------------------
  // Ordering
  // -------------------------

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  // -------------------------
  // Manual Deal Fields (optional)
  // -------------------------

  @Column({ name: 'original_price', type: 'int', nullable: true })
  originalPrice?: number | null;

  @Column({ name: 'deal_price', type: 'int', nullable: true })
  dealPrice?: number | null;

  @Column({ type: 'varchar', length: 10, default: 'THB' })
  currency: string;

  @Column({ name: 'deal_start_at', type: 'datetime', nullable: true })
  dealStartAt?: Date | null;

  @Column({ name: 'deal_end_at', type: 'datetime', nullable: true })
  dealEndAt?: Date | null;

  @Column({ name: 'deal_badge', type: 'varchar', length: 50, nullable: true })
  dealBadge?: string | null;

  @Column({ name: 'deal_url', type: 'varchar', length: 2048, nullable: true })
  dealUrl?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note?: string | null;

  // -------------------------
  // Timestamp
  // -------------------------

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
