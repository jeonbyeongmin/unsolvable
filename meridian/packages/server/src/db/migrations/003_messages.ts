/**
 * Migration 003 — Messages and reactions.
 * Creates the messages and message_reactions tables with full-text search support.
 */
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Messages003 implements MigrationInterface {
  name = '003_messages';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'uuid_generate_v4()' },
          { name: 'channel_id', type: 'uuid' },
          { name: 'author_id', type: 'uuid' },
          { name: 'content', type: 'text' },
          { name: 'attachments', type: 'jsonb', default: "'[]'" },
          { name: 'reply_to', type: 'uuid', isNullable: true },
          { name: 'is_edited', type: 'boolean', default: false },
          { name: 'edited_at', type: 'timestamp', isNullable: true },
          { name: 'is_deleted', type: 'boolean', default: false },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'is_pinned', type: 'boolean', default: false },
          { name: 'pinned_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          { columnNames: ['channel_id'], referencedTableName: 'channels', referencedColumnNames: ['id'], onDelete: 'CASCADE' },
          { columnNames: ['author_id'], referencedTableName: 'users', referencedColumnNames: ['id'] },
        ],
      }),
    );

    await queryRunner.createIndex('messages', new TableIndex({ columnNames: ['channel_id', 'created_at'], name: 'idx_message_channel_created' }));

    // Full-text search column
    await queryRunner.query('ALTER TABLE messages ADD COLUMN tsv tsvector');
    await queryRunner.query("CREATE INDEX idx_message_fts ON messages USING GIN (tsv)");
    await queryRunner.query(`
      CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE ON messages
      FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(tsv, 'pg_catalog.english', content)
    `);

    await queryRunner.createTable(
      new Table({
        name: 'message_reactions',
        columns: [
          { name: 'message_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'emoji', type: 'varchar', length: '32' },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
        foreignKeys: [
          { columnNames: ['message_id'], referencedTableName: 'messages', referencedColumnNames: ['id'], onDelete: 'CASCADE' },
          { columnNames: ['user_id'], referencedTableName: 'users', referencedColumnNames: ['id'] },
        ],
      }),
    );

    await queryRunner.createPrimaryKey('message_reactions', ['message_id', 'user_id', 'emoji']);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('message_reactions');
    await queryRunner.dropTable('messages');
  }
}




