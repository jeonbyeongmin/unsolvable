/**
 * @module @meridian/crypto/utils/format
 * @description Key and digest formatting utilities for the Meridian crypto engine.
 *   Provides human-readable representations of cryptographic material for
 *   logging, debugging, and UI display purposes.
 * @author Arcturus Labs
 */

import { toHex, toBase64Url } from "../encoding";

/**
 * Format a key fingerprint for display purposes.
 * Takes the first 8 bytes of the key material and returns a
 * colon-separated hex string (e.g., "4a:2b:f1:09:ee:d7:03:c8").
 *
 * @param key - Key material to fingerprint
 * @returns Human-readable fingerprint string
 */
export function formatFingerprint(key: Uint8Array): string {
  const prefix = key.subarray(0, 8);
  return Array.from(prefix)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(":");
}

/**
 * Format a full key as a Base64URL string for safe inclusion
 * in URLs, headers, and JSON payloads.
 *
 * @param key - Key material to encode
 * @returns URL-safe Base64 representation
 */
export function formatKeyForTransport(key: Uint8Array): string {
  return toBase64Url(key);
}

/**
 * Format a session ID with its associated key fingerprint
 * for log output.
 *
 * @param sessionId - Session UUID
 * @param key - Session key material
 * @returns Formatted string like "sess:abc123... [fp:4a:2b:f1:...]"
 */
export function formatSessionInfo(sessionId: string, key: Uint8Array): string {
  const shortId = sessionId.slice(0, 8);
  const fingerprint = formatFingerprint(key);
  return `sess:${shortId}... [fp:${fingerprint}]`;
}

/**
 * Redact key material for safe logging.
 * Shows only the first 4 hex characters followed by asterisks.
 *
 * @param key - Sensitive key material
 * @returns Redacted string like "4a2b****..."
 */
export function redactKey(key: Uint8Array): string {
  if (key.length < 2) return "****";
  const visible = toHex(key.subarray(0, 2));
  return `${visible}${"*".repeat(Math.min(key.length * 2 - 4, 60))}`;
}

/**
 * Parse a colon-separated fingerprint back into bytes.
 * Inverse of formatFingerprint.
 *
 * @param fingerprint - Colon-separated hex string
 * @returns Byte array of the fingerprint
 */
export function parseFingerprint(fingerprint: string): Uint8Array {
  const parts = fingerprint.split(":");
  return new Uint8Array(parts.map((p) => parseInt(p, 16)));
}



