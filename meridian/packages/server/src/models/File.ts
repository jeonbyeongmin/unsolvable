/**
 * File entity — tracks uploaded files and their metadata.
 *
 * @module models/File
 */
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('files')
@Index('idx_file_uploader', ['uploadedBy'])
export class File {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 128 })
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'varchar', length: 512 })
  url: string;

  @Column({ type: 'uuid' })
  uploadedBy: string;

  @Column({ type: 'uuid', nullable: true })
  channelId: string | null;

  @Column({ type: 'uuid', nullable: true })
  messageId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}


