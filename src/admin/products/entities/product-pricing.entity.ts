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

@Entity('product_pricing')
@Index('idx_pricing_product', ['productId'], { unique: true })
export class ProductPricing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, name: 'product_id' })
  productId: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'THB' })
  currency: string;

  @Column({ type: 'varchar', length: 255, name: 'price_label' })
  priceLabel: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
