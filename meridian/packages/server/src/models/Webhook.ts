/**
 * Webhook entity — represents a registered webhook subscription.
 *
 * @module models/Webhook
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('webhooks')
@Index('idx_webhook_channel', ['channelId'])
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @Column({ type: 'uuid' })
  channelId: string;

  @Column({ type: 'jsonb', default: '["message:new"]' })
  events: string[];

  @Column({ type: 'varchar', length: 128, select: false })
  secret: string;

  @Column({ type: 'uuid' })
  createdBy: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  failureCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastTriggeredAt: Date | null;

  @Column({ type: 'int', nullable: true })
  lastStatusCode: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



