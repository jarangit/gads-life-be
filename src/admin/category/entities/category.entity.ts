import { Product } from 'src/admin/products/entities/product.entity';
import { nanoid10 } from '../../../utils/nanoid';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

@Entity('categories') // ชื่อ table ใน database
@Index('idx_order_index', ['orderIndex']) // สร้าง index สำหรับ order_index
export class Category {
  // ========================================
  // Primary Key - ใช้ UUID แทน auto-increment
  // ========================================
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }
  // ========================================
  // Unique Column - slug ต้องไม่ซ้ำกัน
  // ========================================
  @Column({
    type: 'varchar',
    length: 255,
    unique: true, // สร้าง unique index อัตโนมัติ
  })
  slug: string;

  // ========================================
  // Required Columns
  // ========================================
  @Column({
    name: 'name_th', // ชื่อ column ใน DB (snake_case)
    type: 'varchar',
    length: 255,
  })
  nameTh: string; // ชื่อ property ใน code (camelCase)

  // ========================================
  // Nullable Columns - ใส่ null ได้
  // ========================================
  @Column({
    name: 'name_en',
    type: 'varchar',
    length: 255,
    nullable: true, // อนุญาตให้เป็น null
  })
  nameEn: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    name: 'hero_image',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  heroImage: string | null;

  // ========================================
  // Boolean Column - ใช้ tinyint ใน MySQL
  // ========================================
  @Column({
    name: 'is_active',
    type: 'tinyint',
    width: 1,
    default: 1, // default เป็น active
  })
  isActive: boolean;

  // ========================================
  // Integer Column - สำหรับเรียงลำดับ
  // ========================================
  @Column({
    name: 'order_index',
    type: 'int',
    default: 0,
  })
  orderIndex: number;

  // ========================================
  // Timestamp Columns - TypeORM จัดการให้อัตโนมัติ
  // ========================================
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  // relation
  // products[]
  @OneToMany(() => Product, (p) => p.category)
  products: Product[];
}
