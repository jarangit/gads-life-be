import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_ratings')
@Index('idx_product_ratings_product', ['productId'])
export class ProductRating {
  @PrimaryGeneratedColumn()
  id: number;

  /** FK ไป products.id */
  @Column({ type: 'varchar', length: 120, name: 'product_id' })
  productId: string;

  /**
   * ชื่อหมวดคะแนน เช่น "ความคุ้มค่า"
   * (ถ้าอนาคตอยากทำเป็น enum หรือ master table ก็ได้)
   */
  @Column({ type: 'varchar', length: 120, name: 'sub_category' })
  subCategory: string;

  /** 1-5 */
  @Column({ type: 'decimal', precision: 3, scale: 1 })
  score: number;

  @ManyToOne(() => Product, (p) => p.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
