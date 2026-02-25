import {
  Entity,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { ContentSection } from './content-section.entity';
import { ContentTag } from './content-tag.entity';
import { nanoid10 } from '../../../utils/nanoid';

export enum ContentType {
  NEWS = 'NEWS',
  REVIEW = 'REVIEW',
  GUIDE = 'GUIDE',
  COMPARISON = 'COMPARISON',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('content_articles')
@Index(['slug'], { unique: true })
@Index(['type', 'status', 'publishedAt'])
export class ContentArticle {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }

  @Column({ type: 'varchar', length: 180 })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary?: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  excerpt?: string | null;

  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @Column({ type: 'enum', enum: ContentStatus, default: ContentStatus.DRAFT })
  status: ContentStatus;

  @Column({ type: 'datetime', name: 'published_at', nullable: true })
  publishedAt?: Date | null;

  @Column({ name: 'is_featured', type: 'tinyint', default: 0 })
  isFeatured: number;

  // SEO
  @Column({ name: 'meta_title', type: 'varchar', length: 255, nullable: true })
  metaTitle?: string | null;

  @Column({
    name: 'meta_description',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  metaDescription?: string | null;

  @Column({
    name: 'hero_image',
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  heroImage?: string | null;

  @Column({
    name: 'hero_image_alt',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  heroImageAlt?: string | null;

  // relations
  @OneToMany(() => ContentSection, (s) => s.article, {
    cascade: true, // ✅ สร้าง sections พร้อมบทความได้
  })
  sections: ContentSection[];

  @OneToMany(() => ContentTag, (t) => t.article, {
    cascade: true, // ✅ สร้าง content_tags พร้อมบทความได้ (แต่ tag ต้องมีอยู่แล้ว)
  })
  tags: ContentTag[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
