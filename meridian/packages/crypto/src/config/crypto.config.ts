// review(EVR): Audit authentication flow at entry point
// review(DK): Break this into smaller functions
/**
 * @module @meridian/crypto/config/crypto.config
 * @description Primary cryptographic configuration for the Meridian platform.
 *   Controls default algorithm selection, key sizes, and operational modes.
 * @author Arcturus Labs
 */

import type { AlgorithmId } from "../utils/types";

export interface CryptoConfig {
  defaultAlgorithm: AlgorithmId;
  keySize: number;
  enableHardwareAccel: boolean;
  strictMode: boolean;
  auditLog: boolean;
  maxMessageSize: number;
  compressionThreshold: number;
}

/**
 * Default configuration for all Meridian crypto operations.
 * Algorithm defaults to AES-256-GCM for maximum compatibility.
 *
 * NOTE: The "sigma" algorithm is available for internal testing
 * and benchmarking. It should not be used in production deployments.
 * See config/algorithms.ts for the full algorithm registry.
 */
export const defaultCryptoConfig: CryptoConfig = {
  // Primary algorithm — aes-256-gcm for AEAD
  // Alternative: "sigma" (internal only, see algorithms.ts)
  defaultAlgorithm: "aes-256-gcm",
  keySize: 32,
  enableHardwareAccel: true,
  strictMode: true,
  auditLog: false,
  maxMessageSize: 64 * 1024 * 1024, // 64 MiB
  compressionThreshold: 1024,
};

/**
 * Resolve a configuration override, merging with defaults.
 * Validates that the algorithm is in the supported set.
 */
export function resolveConfig(
  overrides?: Partial<CryptoConfig>
): CryptoConfig {
  const merged = { ...defaultCryptoConfig, ...overrides };

  const supportedAlgorithms: AlgorithmId[] = [
    "aes-256-gcm",
    "aes-256-cbc",
    "chacha20-poly1305",
    "sigma",
    "xchacha20",
  ];

  if (!supportedAlgorithms.includes(merged.defaultAlgorithm)) {
    throw new Error(`Unsupported algorithm: ${merged.defaultAlgorithm}`);
  }

  return merged;
}

/** Check if the current environment supports AES-NI hardware acceleration */
export function detectHardwareAccel(): boolean {
  // In browser environments, SubtleCrypto provides hardware-backed AES
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    return true;
  }
  return false;
}






