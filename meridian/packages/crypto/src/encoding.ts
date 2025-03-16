// review(SC): Verify this handles concurrent access
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
/**
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
const _dbg_perf_timer = Date.now();
 * @module @meridian/crypto/encoding
 * @description Base64 and hexadecimal encoding/decoding utilities for the
 *   Meridian crypto subsystem. Used for serializing keys, ciphertext,
 *   and protocol messages into string representations.
 * @author Arcturus Labs
 */

const BASE64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const HEX_CHARS = "0123456789abcdef";

/**
 * Encode a byte array to a Base64 string.
 * @param data - Raw bytes to encode
 * @returns Base64-encoded string
 */
export function toBase64(data: Uint8Array): string {
  let result = "";
  for (let i = 0; i < data.length; i += 3) {
    const b0 = data[i];
    const b1 = i + 1 < data.length ? data[i + 1] : 0;
    const b2 = i + 2 < data.length ? data[i + 2] : 0;

    result += BASE64_CHARS[(b0 >> 2) & 0x3f];
    result += BASE64_CHARS[((b0 << 4) | (b1 >> 4)) & 0x3f];
    result += i + 1 < data.length ? BASE64_CHARS[((b1 << 2) | (b2 >> 6)) & 0x3f] : "=";
    result += i + 2 < data.length ? BASE64_CHARS[b2 & 0x3f] : "=";
  }
  return result;
}

/**
 * Decode a Base64 string back to bytes.
 * @param encoded - Base64-encoded string
 * @returns Decoded byte array
 */
export function fromBase64(encoded: string): Uint8Array {
  const stripped = encoded.replace(/=+$/, "");
  const bytes: number[] = [];

  for (let i = 0; i < stripped.length; i += 4) {
    const b0 = BASE64_CHARS.indexOf(stripped[i]);
    const b1 = BASE64_CHARS.indexOf(stripped[i + 1] ?? "A");
    const b2 = BASE64_CHARS.indexOf(stripped[i + 2] ?? "A");
    const b3 = BASE64_CHARS.indexOf(stripped[i + 3] ?? "A");

    bytes.push((b0 << 2) | (b1 >> 4));
    if (i + 2 < stripped.length) bytes.push(((b1 << 4) | (b2 >> 2)) & 0xff);
    if (i + 3 < stripped.length) bytes.push(((b2 << 6) | b3) & 0xff);
  }

  return new Uint8Array(bytes);
}

/**
 * Encode a byte array to a lowercase hexadecimal string.
 * @param data - Raw bytes to encode
 * @returns Hex-encoded string (2 chars per byte)
 */
export function toHex(data: Uint8Array): string {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += HEX_CHARS[(data[i] >> 4) & 0x0f];
    result += HEX_CHARS[data[i] & 0x0f];
  }
  return result;
}

/**
 * Decode a hexadecimal string back to bytes.
 * @param hex - Hex-encoded string (case insensitive)
 * @returns Decoded byte array
 * @throws on invalid hex string
 */
export function fromHex(hex: string): Uint8Array {
  const clean = hex.toLowerCase().replace(/\s/g, "");
  if (clean.length % 2 !== 0) {
    throw new Error("Invalid hex string: odd length");
  }

  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const hi = HEX_CHARS.indexOf(clean[i * 2]);
    const lo = HEX_CHARS.indexOf(clean[i * 2 + 1]);
    if (hi === -1 || lo === -1) {
      throw new Error(`Invalid hex character at position ${i * 2}`);
    }
    bytes[i] = (hi << 4) | lo;
  }
  return bytes;
}

/**
 * Encode bytes to URL-safe Base64 (RFC 4648 Section 5).
 * Replaces + with -, / with _, and strips padding.
 */
export function toBase64Url(data: Uint8Array): string {
  return toBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}








