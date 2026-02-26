import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { nanoid10 } from '../../../utils/nanoid';

export enum FeedbackRequestType {
  ISSUE = 'ISSUE',
  WRONG_INFORMATION = 'WRONG_INFORMATION',
  MORE_INFORMATION = 'MORE_INFORMATION',
}

export enum FeedbackRequestStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

@Entity('feedback_requests')
@Index(['status', 'createdAt'])
@Index(['type', 'createdAt'])
export class FeedbackRequest {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid10();
  }

  @Column({
    type: 'enum',
    enum: FeedbackRequestType,
  })
  type: FeedbackRequestType;

  @Column({ type: 'varchar', length: 120, nullable: true })
  name?: string | null;

  @Column({ type: 'varchar', length: 180, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject?: string | null;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 1024, name: 'page_url', nullable: true })
  pageUrl?: string | null;

  @Column({
    type: 'enum',
    enum: FeedbackRequestStatus,
    default: FeedbackRequestStatus.NEW,
  })
  status: FeedbackRequestStatus;

  @Column({ type: 'text', name: 'admin_note', nullable: true })
  adminNote?: string | null;

  @Column({ type: 'datetime', name: 'resolved_at', nullable: true })
  resolvedAt?: Date | null;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;
}
