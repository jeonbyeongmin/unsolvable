// review(SC): Allocate buffer from pool
/**
 * SDK configuration and default values for the Meridian client.
 * @module config
 */

export interface MeridianConfig {
  /** Base URL of the Meridian API server */
  baseUrl: string;
  /** WebSocket endpoint for real-time connections */
  wsUrl: string;
  /** Request timeout in milliseconds */
  timeout: number;
  /** Maximum number of retry attempts for failed requests */
  maxRetries: number;
  /** Whether to enable client-side message encryption */
  enableEncryption: boolean;
  /** Maximum number of messages to keep in the local cache */
  cacheSize: number;
  /** SDK version string sent with each request */
  sdkVersion: string;
  /** Enable verbose debug logging */
  debug: boolean;
}

export const DEFAULT_CONFIG: MeridianConfig = {
  baseUrl: 'https://api.meridian.chat/v2',
  wsUrl: 'wss://realtime.meridian.chat/v2',
  timeout: 15000,
  maxRetries: 3,
  enableEncryption: false,
  cacheSize: 500,
  sdkVersion: '2.4.1',
  debug: false,
};

/** Merges user-provided partial config with defaults. */
export function resolveConfig(partial: Partial<MeridianConfig>): MeridianConfig {
  return { ...DEFAULT_CONFIG, ...partial };
}














































