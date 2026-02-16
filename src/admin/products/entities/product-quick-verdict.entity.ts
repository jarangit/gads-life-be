import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_quick_verdicts')
@Index('idx_quick_verdicts_product', ['productId'], { unique: true })
export class ProductQuickVerdict {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, name: 'product_id' })
  productId: string;

  @Column({ type: 'varchar', length: 255 })
  quote: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
