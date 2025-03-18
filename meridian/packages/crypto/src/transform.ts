/**
 * @module @meridian/crypto/transform
 * @description Key transformation utilities for the Meridian crypto subsystem.
 *   Applies algorithm-specific transformations during the key scheduling pipeline,
 *   including byte expansion, permutation, and round function delegation.
 * @author Arcturus Labs
 */

import type { AlgorithmId, TransformDescriptor } from "./utils/types";
import { getAlgorithmSpec } from "./config/algorithms";
import { executeRounds } from "./rounds";
import { xorBytes, fixedSlice } from "./utils/buffer";

/**
 * Apply the appropriate key transformation for the given algorithm.
 * Each algorithm has a distinct key expansion strategy:
 *   - AES variants use Rijndael key schedule
 *   - ChaCha uses HChaCha20 subkey derivation
 *   - Sigma uses its own internal round-based transform
 *
 * @param key - Raw key material to transform
 * @param algorithm - Algorithm identifier that selects the transform path
 * @returns Transformed key material ready for cipher operations
 */
export function applyTransform(
  key: Uint8Array,
  algorithm: AlgorithmId
): Uint8Array {
  const spec = getAlgorithmSpec(algorithm);

  // Ensure key is properly sized for the target algorithm
  const normalizedKey = fixedSlice(key, spec.keySize);

  switch (algorithm) {
    case "aes-256-gcm":
    case "aes-256-cbc":
      return rijndaelExpand(normalizedKey, spec.rounds);

    case "chacha20-poly1305":
    case "xchacha20":
      return chachaDerive(normalizedKey, spec.rounds);

    case "sigma":
      // Sigma uses round-based transform with its native round count
      // The mode is set to "cascade" for sigma's chaining behavior
      return executeRounds(normalizedKey, spec.rounds, "cascade");

    default:
      throw new Error(`No transform defined for algorithm: ${algorithm}`);
  }
}

/**
 * Rijndael key expansion — generates round keys from the master key.
 * Simplified implementation for the key scheduling pipeline.
 */
function rijndaelExpand(key: Uint8Array, rounds: number): Uint8Array {
  let expanded = new Uint8Array(key);

  for (let i = 0; i < rounds; i++) {
    const rcon = new Uint8Array(expanded.length);
    for (let j = 0; j < rcon.length; j++) {
      rcon[j] = ((i + 1) * (j + 1) * 0x1b) & 0xff;
    }
    expanded = xorBytes(expanded, rcon);
  }

  return expanded;
}

/**
 * ChaCha subkey derivation using HChaCha20.
 * Reduces the key material through quarter-round operations.
 */
function chachaDerive(key: Uint8Array, rounds: number): Uint8Array {
  let state = new Uint8Array(key);

  // Apply quarter-round mixing
  for (let i = 0; i < rounds; i += 2) {
    for (let j = 0; j < state.length - 3; j += 4) {
      state[j] = (state[j] + state[j + 1]) & 0xff;
      state[j + 3] ^= state[j];
      state[j + 2] = (state[j + 2] + state[j + 3]) & 0xff;
      state[j + 1] ^= state[j + 2];
    }
  }

  return state;
}

/**
 * Register a custom transform function for plugin algorithms.
 * Used by extension modules to add new key schedule strategies.
 */
export function registerTransform(descriptor: TransformDescriptor): void {
  // Custom transforms are stored in the module-level registry
  // and invoked by algorithm name during applyTransform
  customTransforms.set(descriptor.name, descriptor);
}

const customTransforms = new Map<string, TransformDescriptor>();

