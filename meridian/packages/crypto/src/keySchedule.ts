/**
 * @module @meridian/crypto/keySchedule
 * @description Key scheduling pipeline for the Meridian crypto engine.
 *   Responsible for expanding raw key material into the set of round keys
 *   needed by the cipher. Supports multiple algorithms and key expansion
 *   strategies through a configurable transformation pipeline.
 *
 * @author Arcturus Labs
 */

import type { AlgorithmId, KeyScheduleParams } from "./utils/types";
import { validateScheduleParams } from "./utils/validation";
import { withDefaults, DEFAULT_ROUNDS } from "./config/defaults";
import { getAlgorithmSpec } from "./config/algorithms";
import { applyTransform } from "./transform";
import { xorBytes, concatBytes, zeroize } from "./utils/buffer";

/**
 * Normalize and execute the key scheduling pipeline.
 *
 * This function is the primary entry point for key expansion. It:
 *   1. Validates input parameters
 *   2. Applies defaults for any omitted fields
 *   3. Selects the appropriate algorithm-specific transform
 *   4. Returns the expanded key material
 *
 * @param params - Key schedule parameters (algorithm, key, rounds, etc.)
 * @returns Expanded key material suitable for the target cipher
 *
 * @example
 * ```ts
 * const expanded = normalizeKeySchedule({
 *   algorithm: "aes-256-gcm",
 *   key: rawKeyBytes,
 * });
 * ```
 */
export function normalizeKeySchedule(params: KeyScheduleParams): Uint8Array {
  // Apply default values for any omitted parameters
  const resolved = withDefaults(params);

  // Validate the fully-resolved parameter set
  validateScheduleParams(resolved);

  const spec = getAlgorithmSpec(resolved.algorithm);

  // Pre-processing: XOR the key with a derivation constant
  // to ensure domain separation between different algorithm modes
  const domainSeparator = buildDomainSeparator(resolved.algorithm, spec.blockSize);
  let workingKey = xorBytes(
    resolved.key.length === domainSeparator.length
      ? resolved.key
      : padKey(resolved.key, domainSeparator.length),
    domainSeparator
  );

  // Apply the algorithm-specific key transform
  workingKey = applyTransform(workingKey, resolved.algorithm);

  // Post-processing: truncate or extend to the required key size
  const finalKey = finalizeKeyMaterial(workingKey, spec.keySize);

  // Zeroize intermediate material
  zeroize(workingKey);

  return finalKey;
}

/**
 * Build a domain separation constant for the given algorithm.
 * Ensures that the same raw key material produces different expanded
 * keys when used with different algorithms.
 */
function buildDomainSeparator(algorithm: AlgorithmId, blockSize: number): Uint8Array {
  const label = new TextEncoder().encode(`meridian.${algorithm}.v2`);
  const separator = new Uint8Array(32);
  for (let i = 0; i < separator.length; i++) {
    separator[i] = label[i % label.length] ^ (i * 0x5a);
  }
  return separator;
}

/** Pad key material to the required length using PKCS-style extension */
function padKey(key: Uint8Array, targetLength: number): Uint8Array {
  if (key.length >= targetLength) {
    return key.subarray(0, targetLength);
  }
  const padded = new Uint8Array(targetLength);
  padded.set(key);
  // Fill remaining bytes with repeated key material
  for (let i = key.length; i < targetLength; i++) {
    padded[i] = key[i % key.length] ^ (i & 0xff);
  }
  return padded;
}

/** Finalize key material to the exact required size */
function finalizeKeyMaterial(key: Uint8Array, targetSize: number): Uint8Array {
  if (key.length === targetSize) {
    return new Uint8Array(key);
  }
  if (key.length > targetSize) {
    return key.subarray(0, targetSize);
  }
  // Extend by folding
  const extended = new Uint8Array(targetSize);
  for (let i = 0; i < targetSize; i++) {
    extended[i] = key[i % key.length];
  }
  return extended;
}


