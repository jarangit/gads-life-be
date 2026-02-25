import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentArticle } from './content-article.entity';
import { nanoid10 } from '../../../utils/nanoid';

@Entity('content_tags')
@Index('ux_content_tags_article_value', ['articleId', 'value'], {
  unique: true,
})
export class ContentTag {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }

  @Column({ name: 'article_id', type: 'varchar', length: 10 })
  articleId: string;

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
