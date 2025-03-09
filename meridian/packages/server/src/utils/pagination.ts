/**
 * Pagination utilities — parse query parameters and return paginated results.
 *
 * @module utils/pagination
 */

export interface PaginationParams {
  limit: number;
  offset: number;
  page: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
  nextPage?: number;
}

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

/**
 * Parse pagination query parameters from an Express request.
 * Supports both page-based and offset-based pagination.
 *
 * @param query - The request query object
 * @returns Normalized pagination parameters
 */
export function parsePagination(query: Record<string, unknown>): PaginationParams {
  let limit = parseInt(String(query.limit || query.per_page || DEFAULT_LIMIT), 10);
  limit = Math.min(Math.max(1, limit), MAX_LIMIT);

  const page = Math.max(1, parseInt(String(query.page || '1'), 10));
  let offset = parseInt(String(query.offset || '0'), 10);

  // If page is provided and offset isn't explicitly set, calculate offset from page
  if (query.page && !query.offset) {
    offset = (page - 1) * limit;
  }

  return { limit, offset, page };
}

/**
 * Build a paginated result from items array and total count.
 */
export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  return {
    items,
    total,
    limit: params.limit,
    offset: params.offset,
    hasMore: params.offset + items.length < total,
    nextPage: params.offset + items.length < total ? params.page + 1 : undefined,
  };
}

