import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

export enum FinalVerdictType {
  BUY_IF = 'BUY_IF',
  SKIP_IF = 'SKIP_IF',
}

@Entity('product_final_verdict_points')
@Index('idx_final_verdict_product', ['productId'])
@Index('idx_final_verdict_type', ['type'])
export class ProductFinalVerdictPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, name: 'product_id' })
  productId: string;

  @Column({ type: 'enum', enum: FinalVerdictType })
  type: FinalVerdictType;

  @Column({ type: 'varchar', length: 255 })
  text: string;

  // เผื่ออยากคุมลำดับแสดงผล
  @Column({ type: 'int', unsigned: true, name: 'order_index', default: 0 })
  orderIndex: number;

  @ManyToOne(() => Product, (p) => p.finalVerdictPoints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
