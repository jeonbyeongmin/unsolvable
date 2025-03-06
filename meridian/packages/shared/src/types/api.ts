/**
 * @module @meridian/shared/types/api
 * @description API request/response envelope types for Meridian Chat Platform
 * @copyright Arcturus Labs 2024-2026
 */

/** Standard success wrapper returned by all API endpoints */
export interface ApiResponse<T> {
  success: true;
  data: T;
  requestId: string;
  timestamp: string;
}

/** Cursor-based paginated list returned by collection endpoints */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    cursor: string | null;
    hasMore: boolean;
  };
  requestId: string;
  timestamp: string;
}

/** Structured error body returned on failure */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId: string;
  timestamp: string;
}

/** Union of all possible API response shapes */
export type ApiResult<T> = ApiResponse<T> | PaginatedResponse<T> | ErrorResponse;

/** Standard query parameters accepted by list endpoints */
export interface PaginationParams {
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}



