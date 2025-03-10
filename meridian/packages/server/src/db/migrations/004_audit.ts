/**
 * Migration 004 — Audit logs, webhooks, notifications, and files.
 */
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Audit004 implements MigrationInterface {
  name = '004_audit';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'action', type: 'varchar', length: '100' },
          { name: 'actor_id', type: 'uuid' },
          { name: 'metadata', type: 'text', isNullable: true },
          { name: 'ip_address', type: 'varchar', length: '45', isNullable: true },
          { name: 'timestamp', type: 'timestamp', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex('audit_logs', new TableIndex({ columnNames: ['action'], name: 'idx_audit_action' }));
    await queryRunner.createIndex('audit_logs', new TableIndex({ columnNames: ['timestamp'], name: 'idx_audit_timestamp' }));

    await queryRunner.createTable(
      new Table({
        name: 'webhooks',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'url', type: 'varchar', length: '2048' },
          { name: 'channel_id', type: 'uuid' },
          { name: 'events', type: 'jsonb', default: "'[\"message:new\"]'" },
          { name: 'secret', type: 'varchar', length: '128' },
          { name: 'created_by', type: 'uuid' },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'failure_count', type: 'int', default: 0 },
          { name: 'last_triggered_at', type: 'timestamp', isNullable: true },
          { name: 'last_status_code', type: 'int', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'user_id', type: 'uuid' },
          { name: 'type', type: 'varchar', length: '50' },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'body', type: 'text' },
          { name: 'resource_type', type: 'varchar', length: '50', isNullable: true },
          { name: 'resource_id', type: 'uuid', isNullable: true },
          { name: 'actor_id', type: 'uuid', isNullable: true },
          { name: 'is_read', type: 'boolean', default: false },
          { name: 'read_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'filename', type: 'varchar', length: '255' },
          { name: 'original_name', type: 'varchar', length: '255' },
          { name: 'mime_type', type: 'varchar', length: '128' },
          { name: 'size', type: 'bigint' },
          { name: 'url', type: 'varchar', length: '512' },
          { name: 'uploaded_by', type: 'uuid' },
          { name: 'channel_id', type: 'uuid', isNullable: true },
          { name: 'message_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('files');
    await queryRunner.dropTable('notifications');
    await queryRunner.dropTable('webhooks');
    await queryRunner.dropTable('audit_logs');
  }
}






