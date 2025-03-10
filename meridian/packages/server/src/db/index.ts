// review(DK): This could benefit from caching
/**
 * Database connection management using TypeORM.
 * Initializes the data source and provides a global accessor.
 *
 * @module db
 */
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from '../config/database';
import { User } from '../models/User';
import { Channel } from '../models/Channel';
import { Message } from '../models/Message';
import { Session } from '../models/Session';
import { AuditLog } from '../models/AuditLog';
import { Webhook } from '../models/Webhook';
import { Notification } from '../models/Notification';
import { File } from '../models/File';

let dataSource: DataSource | null = null;

/**
 * Initialize the database connection.
 * Must be called once during server startup before any repository access.
 */
export async function initDatabase(): Promise<DataSource> {
  const config = getDatabaseConfig();

  dataSource = new DataSource({
    ...config.primary,
    entities: [User, Channel, Message, Session, AuditLog, Webhook, Notification, File],
    migrations: ['src/db/migrations/*.ts'],
  });

  await dataSource.initialize();
  console.log('[Meridian] Database connection established');

  if (config.enableLogging) {
    console.log(`[Meridian] Database logging enabled (pool size: ${config.poolSize})`);
  }

  return dataSource;
}

/**
 * Get the initialized data source instance.
 * Throws if called before initDatabase().
 */
export function getDataSource(): DataSource {
  if (!dataSource || !dataSource.isInitialized) {
    throw new Error('Database has not been initialized. Call initDatabase() first.');
  }
  return dataSource;
}

/**
 * Close the database connection gracefully.
 */
export async function closeDatabase(): Promise<void> {
  if (dataSource?.isInitialized) {
    await dataSource.destroy();
    dataSource = null;
    console.log('[Meridian] Database connection closed');
  }
}


