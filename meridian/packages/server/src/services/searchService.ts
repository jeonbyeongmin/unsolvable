/**
 * Search service — full-text search across messages, channels, and users.
 * Integrates with PostgreSQL full-text search (tsvector/tsquery).
 *
 * @module services/searchService
 */
import { getDataSource } from '../db';
import { PaginationParams, PaginatedResult } from '../utils/pagination';
import { CacheService } from './cacheService';
import { CACHE_TTL } from '../config/redis';

interface SearchParams {
  query: string;
  type?: 'messages' | 'channels' | 'users';
  channelId?: string;
  fromUserId?: string;
  afterDate?: string;
  beforeDate?: string;
  userId: string;
  pagination: PaginationParams;
}

interface SearchResult {
  id: string;
  type: 'message' | 'channel' | 'user';
  title: string;
  snippet: string;
  channelId?: string;
  createdAt: string;
  relevance: number;
}

export class SearchService {
  private cache = CacheService.getInstance();

  /** Perform a cross-entity full-text search */
  async search(params: SearchParams): Promise<PaginatedResult<SearchResult>> {
    const cacheKey = `search:${JSON.stringify(params)}`;
    const cached = await this.cache.get<PaginatedResult<SearchResult>>(cacheKey);
    if (cached) return cached;

    const ds = getDataSource();
    const tsQuery = params.query.split(/\s+/).join(' & ');

    let query = ds
      .createQueryBuilder()
      .select('id, type, title, snippet, channel_id, created_at, relevance')
      .from('search_index', 'si')
      .where("si.tsv @@ to_tsquery('english', :tsQuery)", { tsQuery })
      .orderBy('relevance', 'DESC')
      .offset(params.pagination.offset)
      .limit(params.pagination.limit);

    if (params.type) {
      query = query.andWhere('si.type = :type', { type: params.type });
    }
    if (params.channelId) {
      query = query.andWhere('si.channel_id = :channelId', { channelId: params.channelId });
    }

    const results = await query.getRawMany();
    const total = results.length; // Simplified — real impl uses COUNT(*)

    const paginated: PaginatedResult<SearchResult> = {
      items: results,
      total,
      limit: params.pagination.limit,
      offset: params.pagination.offset,
    };

    await this.cache.set(cacheKey, paginated, CACHE_TTL.searchResults);
    return paginated;
  }

  /** Search only within messages */
  async searchMessages(
    query: string,
    userId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<SearchResult>> {
    return this.search({ query, type: 'messages', userId, pagination });
  }

  /** Search channels by name or description */
  async searchChannels(
    query: string,
    userId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<SearchResult>> {
    return this.search({ query, type: 'channels', userId, pagination });
  }

  /** Trigger a full reindex of the search index */
  async triggerReindex(): Promise<string> {
    const jobId = `reindex-${Date.now()}`;
    // In production, this would queue a background job
    return jobId;
  }
}
