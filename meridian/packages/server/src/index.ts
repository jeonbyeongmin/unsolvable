// review(MPH): Consider refactoring this into a helper
/**
 * Meridian Chat Platform — Express Application Setup
 * Copyright (c) 2025 Arcturus Labs. All rights reserved.
 */
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { corsMiddleware } from './middleware/cors';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { channelRoutes } from './routes/channels';
import { messageRoutes } from './routes/messages';
import { adminRoutes } from './routes/admin';
import { healthRoutes } from './routes/health';
import { uploadRoutes } from './routes/upload';
import { webhookRoutes } from './routes/webhooks';
import { searchRoutes } from './routes/search';
import { loadConfig } from './config';

const app = express();
const config = loadConfig();

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: config.maxRequestSize }));
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(requestLogger);
app.use(rateLimiter);

/** API route registration */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/channels', channelRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/search', searchRoutes);

app.use(errorHandler);

export { app };
export default app;


