/**
 * @fileoverview HTTP client wrapper for the Meridian REST API.
 * Handles authentication headers, token refresh, and error normalization.
 * @module utils/api
 */

import { API_BASE_URL, AUTH_STORAGE_KEY } from './constants';
import { getStorageItem } from './storage';
import type { ApiError, AuthTokens } from '../types';

/** Builds the default headers for API requests, injecting the bearer token. */
function getHeaders(): HeadersInit {
  const tokens = getStorageItem<AuthTokens>(AUTH_STORAGE_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client': 'meridian-web',
  };
  if (tokens?.accessToken) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  }
  return headers;
}

/** Normalizes fetch responses into a consistent result or throws an ApiError. */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error: ApiError = {
      code: body.code ?? 'UNKNOWN_ERROR',
      message: body.message ?? response.statusText,
      details: body.details,
    };
    throw error;
  }
  return response.json() as Promise<T>;
}

/** Sends a GET request to the specified API path. */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: getHeaders() });
  return handleResponse<T>(response);
}

/** Sends a POST request with a JSON body. */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

/** Sends a PATCH request with a partial JSON body. */
export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}

/** Sends a DELETE request to the specified API path. */
export async function apiDelete(path: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    await handleResponse(response);
  }
}





















