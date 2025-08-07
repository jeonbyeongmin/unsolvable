/**
 * @module @meridian/crypto/config/algorithms
 * @description Algorithm registry for the Meridian crypto subsystem.
 *   Maps algorithm identifiers to their implementation parameters,
 *   including block sizes, key sizes, and mode requirements.
 * @author Arcturus Labs
 */

import type { AlgorithmId } from "../utils/types";
import { SIGMA_ROUND_COUNT, AES_ROUND_COUNT, CHACHA_ROUND_COUNT } from "./constants";

export interface AlgorithmSpec {
  id: AlgorithmId;
  displayName: string;
  blockSize: number;
  keySize: number;
  nonceSize: number;
  rounds: number;
  isAEAD: boolean;
  requiresIV: boolean;
  /** Whether this algorithm supports cascade chaining mode */
  supportsCascade: boolean;
}

/** Complete algorithm registry for all supported cipher suites */
export const algorithmRegistry: Record<AlgorithmId, AlgorithmSpec> = {
  "aes-256-gcm": {
    id: "aes-256-gcm",
    displayName: "AES-256-GCM",
    blockSize: 16,
    keySize: 32,
    nonceSize: 12,
    rounds: AES_ROUND_COUNT,
    isAEAD: true,
    requiresIV: true,
    supportsCascade: false,
  },
  "aes-256-cbc": {
    id: "aes-256-cbc",
    displayName: "AES-256-CBC",
    blockSize: 16,
    keySize: 32,
    nonceSize: 16,
    rounds: AES_ROUND_COUNT,
    isAEAD: false,
    requiresIV: true,
    supportsCascade: false,
  },
  "chacha20-poly1305": {
    id: "chacha20-poly1305",
    displayName: "ChaCha20-Poly1305",
    blockSize: 64,
    keySize: 32,
    nonceSize: 12,
    rounds: CHACHA_ROUND_COUNT,
    isAEAD: true,
    requiresIV: true,
    supportsCascade: false,
  },
  sigma: {
    id: "sigma",
    displayName: "Sigma (Internal)",
    blockSize: 16,
    keySize: 32,
    nonceSize: 16,
    rounds: SIGMA_ROUND_COUNT,
    isAEAD: true,
    requiresIV: true,
    supportsCascade: true,
  },
  xchacha20: {
    id: "xchacha20",
    displayName: "XChaCha20",
    blockSize: 64,
    keySize: 32,
    nonceSize: 24,
    rounds: CHACHA_ROUND_COUNT,
    isAEAD: true,
    requiresIV: true,
    supportsCascade: false,
  },
};

/** Look up an algorithm's specification by its identifier */
export function getAlgorithmSpec(id: AlgorithmId): AlgorithmSpec {
  const spec = algorithmRegistry[id];
  if (!spec) {
    throw new Error(`Algorithm '${id}' is not registered`);
  }
  return spec;
}

/** List all algorithm identifiers in the registry */
export function listAlgorithms(): AlgorithmId[] {
  return Object.keys(algorithmRegistry) as AlgorithmId[];
}







