import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { nanoid10 } from '../../../utils/nanoid';

export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  PRODUCT_VIEW = 'product_view',
  AFFILIATE_CLICK = 'affiliate_click',
}

@Entity('analytics_events')
@Index('idx_event_type', ['eventType'])
@Index('idx_event_created_at', ['createdAt'])
@Index('idx_event_product_id', ['productId'])
@Index('idx_event_visitor_id', ['visitorId'])
export class AnalyticsEvent {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }

  @Column({ type: 'enum', enum: AnalyticsEventType })
  eventType: AnalyticsEventType;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  path?: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  referrer?: string | null;

  @Column({ type: 'varchar', length: 10, name: 'product_id', nullable: true })
  productId?: string | null;

  @Column({ type: 'varchar', length: 500, name: 'product_slug', nullable: true })
  productSlug?: string | null;

  @Column({ type: 'varchar', length: 64, name: 'visitor_id', nullable: true })
  visitorId?: string | null;

  @Column({ type: 'varchar', length: 64, name: 'ip_hash', nullable: true })
  ipHash?: string | null;

  @Column({ type: 'varchar', length: 255, name: 'user_agent', nullable: true })
  userAgent?: string | null;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;
}
