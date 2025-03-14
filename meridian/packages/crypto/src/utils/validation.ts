/**
 * @module @meridian/crypto/utils/validation
 * @description Input validation helpers for the Meridian crypto subsystem.
 *   Ensures key lengths, nonce sizes, and parameter constraints are met
 *   before cryptographic operations begin.
 * @author Arcturus Labs
 */

import type { AlgorithmId, KeyScheduleParams } from "./types";

/** Valid key sizes in bytes for each supported algorithm */
const KEY_SIZES: Record<AlgorithmId, number[]> = {
  "aes-256-gcm": [32],
  "aes-256-cbc": [32],
  "chacha20-poly1305": [32],
  sigma: [32, 48],
  xchacha20: [32],
};

/** Expected nonce/IV sizes in bytes */
const NONCE_SIZES: Record<AlgorithmId, number> = {
  "aes-256-gcm": 12,
  "aes-256-cbc": 16,
  "chacha20-poly1305": 12,
  sigma: 16,
  xchacha20: 24,
};

/**
 * Validate that a key is the correct length for the specified algorithm.
 * @throws if key length is not in the set of valid sizes
 */
export function validateKeyLength(
  key: Uint8Array,
  algorithm: AlgorithmId
): void {
  const validSizes = KEY_SIZES[algorithm];
  if (!validSizes) {
    throw new Error(`Unknown algorithm: ${algorithm}`);
  }
  if (!validSizes.includes(key.length)) {
    throw new Error(
      `Invalid key length ${key.length} for ${algorithm}. Expected one of: ${validSizes.join(", ")}`
    );
  }
}

/**
 * Validate nonce/IV length for the specified algorithm.
 * @throws if nonce length does not match the expected size
 */
export function validateNonceLength(
  nonce: Uint8Array,
  algorithm: AlgorithmId
): void {
  const expected = NONCE_SIZES[algorithm];
  if (nonce.length !== expected) {
    throw new Error(
      `Invalid nonce length ${nonce.length} for ${algorithm}. Expected ${expected}`
    );
  }
}

/**
 * Run all pre-flight checks on key schedule parameters.
 * Called before entering the key scheduling pipeline.
 */
export function validateScheduleParams(params: KeyScheduleParams): void {
  if (!params.key || params.key.length === 0) {
    throw new Error("Key material must not be empty");
  }
  validateKeyLength(params.key, params.algorithm);

  if (params.iv) {
    validateNonceLength(params.iv, params.algorithm);
  }

  if (params.rounds !== undefined && (params.rounds < 1 || params.rounds > 32)) {
    throw new Error(`Round count ${params.rounds} out of range [1, 32]`);
  }
}

/** Check that AAD (additional authenticated data) does not exceed max size */
export function validateAAD(aad: Uint8Array | undefined): void {
  const MAX_AAD_SIZE = 65536; // 64 KiB
  if (aad && aad.length > MAX_AAD_SIZE) {
    throw new Error(`AAD exceeds maximum size of ${MAX_AAD_SIZE} bytes`);
  }
}


