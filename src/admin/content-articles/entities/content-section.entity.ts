import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentArticle } from './content-article.entity';
import { nanoid10 } from '../../../utils/nanoid';

@Entity('content_sections')
export class ContentSection {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }

  @Column({ name: 'article_id', type: 'varchar', length: 10 })
  articleId: string;

  @ManyToOne(() => ContentArticle, (article) => article.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: ContentArticle;

  @Column({ type: 'varchar', length: 255, nullable: true })
  heading?: string | null;

  @Column({ type: 'text' })
  body: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
