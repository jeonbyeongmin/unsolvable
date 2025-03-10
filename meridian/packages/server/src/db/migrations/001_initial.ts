/**
 * Migration 001 — Initial schema setup.
 * Creates the users and sessions tables.
 */
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Initial001 implements MigrationInterface {
  name = '001_initial';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password_hash', type: 'varchar', length: '255' },
          { name: 'display_name', type: 'varchar', length: '64' },
          { name: 'bio', type: 'varchar', length: '500', isNullable: true },
          { name: 'avatar_url', type: 'varchar', length: '512', isNullable: true },
          { name: 'role', type: 'varchar', length: '20', default: "'user'" },
          { name: 'timezone', type: 'varchar', length: '50', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'is_banned', type: 'boolean', default: false },
          { name: 'ban_reason', type: 'varchar', length: '500', isNullable: true },
          { name: 'banned_until', type: 'timestamp', isNullable: true },
          { name: 'deactivated_at', type: 'timestamp', isNullable: true },
          { name: 'last_login_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex('users', new TableIndex({ columnNames: ['email'], name: 'idx_user_email' }));

    await queryRunner.createTable(
      new Table({
        name: 'sessions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'user_id', type: 'uuid' },
          { name: 'refresh_token', type: 'text' },
          { name: 'device_id', type: 'varchar', length: '255', default: "'unknown'" },
          { name: 'user_agent', type: 'varchar', length: '255', isNullable: true },
          { name: 'ip_address', type: 'varchar', length: '45', isNullable: true },
          { name: 'expires_at', type: 'timestamp' },
          { name: 'is_revoked', type: 'boolean', default: false },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          { columnNames: ['user_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE' },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sessions');
    await queryRunner.dropTable('users');
  }
}





