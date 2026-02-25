import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentArticle } from './content-article.entity';

@Entity('content_sections')
export class ContentSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'article_id' })
  articleId: number;

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
