// import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
// import { Product } from './product.entity';

// @Entity('product_quick_verdicts')
// export class ProductQuickVerdict {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 255 })
//   quote: string;

//   @Column({ type: 'text' })
//   description: string;

//   /** tags: ["หูฟังไร้สาย","Apple"] */
//   @Column({ type: 'json' })
//   tags: string[];

//   @OneToOne(() => Product, (p) => p.quickVerdict)
//   product: Product;
// }