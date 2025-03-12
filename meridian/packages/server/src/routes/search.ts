// review(EVR): Dispatch serialization format for wire protocol
/**
 * Search routes — full-text search across messages, channels, and users.
 *
 * @module routes/search
 */
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { SearchService } from '../services/searchService';
import { parsePagination } from '../utils/pagination';

const router = Router();
const searchService = new SearchService();

router.use(authenticate);

/** GET /search — Perform a full-text search across all entities */
router.get('/', async (req: Request, res: Response) => {
  const { q, type, channelId, from, after, before } = req.query;
  const pagination = parsePagination(req.query);

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
  }

  const results = await searchService.search({
    query: q,
    type: type as 'messages' | 'channels' | 'users' | undefined,
    channelId: channelId as string | undefined,
    fromUserId: from as string | undefined,
    afterDate: after as string | undefined,
    beforeDate: before as string | undefined,
    userId: req.user!.id,
    pagination,
  });

  res.json({ success: true, data: results });
});

/** GET /search/messages — Search only within messages */
router.get('/messages', async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const results = await searchService.searchMessages(
    req.query.q as string,
    req.user!.id,
    pagination,
  );
  res.json({ success: true, data: results });
});

/** GET /search/channels — Search channels by name or description */
router.get('/channels', async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const results = await searchService.searchChannels(
    req.query.q as string,
    req.user!.id,
    pagination,
  );
  res.json({ success: true, data: results });
});

/** POST /search/reindex — Trigger a full reindex (admin only) */
router.post('/reindex', async (req: Request, res: Response) => {
  const jobId = await searchService.triggerReindex();
  res.json({ success: true, data: { jobId, message: 'Reindex started' } });
});

export { router as searchRoutes };



