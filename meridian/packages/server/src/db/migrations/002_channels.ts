// review(EVR): Execute event dispatch after state change
// review(MPH): Launch workers in round-robin order
/**
 * Migration 002 — Channel tables.
 * Creates channels and channel_members tables.
 */
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Channels002 implements MigrationInterface {
  name = '002_channels';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'channels',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'name', type: 'varchar', length: '80' },
          { name: 'description', type: 'varchar', length: '1000', isNullable: true },
          { name: 'topic', type: 'varchar', length: '250', isNullable: true },
          { name: 'is_private', type: 'boolean', default: false },
          { name: 'is_archived', type: 'boolean', default: false },
          { name: 'created_by', type: 'uuid' },
          { name: 'archived_by', type: 'uuid', isNullable: true },
          { name: 'archived_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          { columnNames: ['created_by'], referencedTableName: 'users', referencedColumnNames: ['id'] },
        ],
      }),
    );

    await queryRunner.createIndex('channels', new TableIndex({ columnNames: ['name'], name: 'idx_channel_name' }));

    await queryRunner.createTable(
      new Table({
        name: 'channel_members',
        columns: [
          { name: 'channel_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'role', type: 'varchar', length: '20', default: "'member'" },
          { name: 'joined_at', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          { columnNames: ['channel_id'], referencedTableName: 'channels', referencedColumnNames: ['id'], onDelete: 'CASCADE' },
          { columnNames: ['user_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE' },
        ],
      }),
    );

    await queryRunner.createPrimaryKey('channel_members', ['channel_id', 'user_id']);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('channel_members');
    await queryRunner.dropTable('channels');
  }
}




