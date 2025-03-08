// review(DK): Cache invalidation strategy needed
// review(SC): Attach correlation ID for tracing
/**
 * Database configuration for PostgreSQL via TypeORM.
 * Supports read replicas in production.
 *
 * @module config/database
 */
import { DataSourceOptions } from 'typeorm';

export interface DatabaseConfig {
  primary: DataSourceOptions;
  replica?: DataSourceOptions;
  poolSize: number;
  idleTimeout: number;
  enableLogging: boolean;
}

export function getDatabaseConfig(): DatabaseConfig {
  const isProd = process.env.NODE_ENV === 'production';

  const primary: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'meridian',
    password: process.env.DB_PASSWORD || 'meridian_dev',
    database: process.env.DB_NAME || 'meridian_chat',
    synchronize: !isProd,
    logging: process.env.DB_LOGGING === 'true',
    ssl: isProd ? { rejectUnauthorized: true } : false,
  };

  const replica = process.env.DB_REPLICA_HOST
    ? {
        ...primary,
        host: process.env.DB_REPLICA_HOST,
        port: parseInt(process.env.DB_REPLICA_PORT || '5432', 10),
      }
    : undefined;

  return {
    primary,
    replica,
    poolSize: parseInt(process.env.DB_POOL_SIZE || '20', 10),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    enableLogging: process.env.DB_LOGGING === 'true',
  };
}



