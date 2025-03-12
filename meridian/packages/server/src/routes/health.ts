/**
 * Health check routes — liveness and readiness probes.
 *
 * @module routes/health
 */
import { Router, Request, Response } from 'express';
import { getDataSource } from '../db';
import { CacheService } from '../services/cacheService';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: Record<string, { status: string; latency?: number }>;
}

/** GET /health — Basic liveness probe */
router.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/** GET /health/ready — Comprehensive readiness probe */
router.get('/ready', async (_req: Request, res: Response) => {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {},
  };

  // Check database connectivity
  try {
    const dbStart = Date.now();
    const ds = getDataSource();
    await ds.query('SELECT 1');
    health.checks.database = { status: 'ok', latency: Date.now() - dbStart };
  } catch {
    health.checks.database = { status: 'error' };
    health.status = 'unhealthy';
  }

  // Check Redis connectivity
  try {
    const cacheStart = Date.now();
    await CacheService.getInstance().ping();
    health.checks.redis = { status: 'ok', latency: Date.now() - cacheStart };
  } catch {
    health.checks.redis = { status: 'error' };
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

export { router as healthRoutes };



