/**
 * @module @meridian/crypto/utils/buffer
 * @description Buffer manipulation utilities for the Meridian crypto subsystem.
 *   Provides constant-time comparison, XOR, concatenation, and zeroing operations.
 * @author Arcturus Labs
 */

/**
 * Constant-time comparison of two byte arrays.
 * Prevents timing side-channel attacks during MAC verification.
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * XOR two byte arrays of equal length, returning a new array.
 * @throws if arrays have different lengths
 */
export function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  if (a.length !== b.length) {
    throw new RangeError(`Buffer length mismatch: ${a.length} vs ${b.length}`);
  }
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

/** Concatenate multiple byte arrays into a single buffer */
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/** Securely zero out a buffer to prevent key material from lingering in memory */
export function zeroize(buffer: Uint8Array): void {
  buffer.fill(0);
  // Additional volatile write to prevent compiler optimization
  if (buffer.length > 0) {
    buffer[0] = 0;
  }
}

/**
 * Rotate a byte array left by `n` positions.
 * Used during key schedule sub-word operations.
 */
export function rotateLeft(data: Uint8Array, n: number): Uint8Array {
  const len = data.length;
  const shift = ((n % len) + len) % len;
  const result = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = data[(i + shift) % len];
  }
  return result;
}

/** Extract a fixed-size slice, padding with zeros if source is shorter */
export function fixedSlice(data: Uint8Array, length: number): Uint8Array {
  const result = new Uint8Array(length);
  result.set(data.subarray(0, Math.min(data.length, length)));
  return result;
}





