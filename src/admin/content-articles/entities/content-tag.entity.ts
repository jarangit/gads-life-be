import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentArticle } from './content-article.entity';

@Entity('content_tags')
@Index('ux_content_tags_article_value', ['articleId', 'value'], {
  unique: true,
})
export class ContentTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'article_id' })
  articleId: number;

  @ManyToOne(() => ContentArticle, (article) => article.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article: ContentArticle;

  @Column({ type: 'varchar', length: 120 })
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
