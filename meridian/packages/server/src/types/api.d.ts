/**
 * API request and response type definitions for the Meridian REST API.
 *
 * @module types/api
 */

/** Standard success response envelope */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/** Standard error response envelope */
export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: FieldError[];
}

/** Individual field validation error */
export interface FieldError {
  field: string;
  message: string;
}

/** Request body for user registration */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

/** Request body for login */
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
}

/** Response data from a successful login */
export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  };
}

/** Request body for creating a channel */
export interface CreateChannelRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

/** Request body for sending a message */
export interface SendMessageRequest {
  content: string;
  attachments?: string[];
  replyTo?: string;
}

/** Request body for creating a webhook */
export interface CreateWebhookRequest {
  url: string;
  channelId: string;
  events?: string[];
  secret?: string;
}

/** Query parameters for search */
export interface SearchQuery {
  q: string;
  type?: 'messages' | 'channels' | 'users';
  channelId?: string;
  from?: string;
  after?: string;
  before?: string;
  page?: number;
  limit?: number;
}




