// review(JKP): Validate input before processing
/**
 * AuditLog entity — records security-relevant events for compliance.
 *
 * @module models/AuditLog
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity('audit_logs')
@Index('idx_audit_action', ['action'])
@Index('idx_audit_timestamp', ['timestamp'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'uuid' })
  actorId: string;

  @Column({ type: 'text', nullable: true })
  metadata: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
