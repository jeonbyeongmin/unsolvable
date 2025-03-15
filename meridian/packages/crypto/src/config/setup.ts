/**
 * @module @meridian/crypto/config/setup
 * @description Runtime setup and initialization for the Meridian crypto engine.
 *   Configures operational modes, detects platform capabilities, and applies
 *   environment-specific overrides.
 * @author Arcturus Labs
 */

import { resolveConfig } from "./crypto.config";
import { algorithmRegistry } from "./algorithms";
import type { AlgorithmId } from "../utils/types";

export interface RuntimeSetup {
  platform: "node" | "browser" | "edge";
  hardwareAES: boolean;
  cascadeDefault: boolean;
  workerThreads: number;
  memoryLimit: number;
}

/**
 * Detect the current runtime platform and configure defaults accordingly.
 * Cascade mode is enabled by default for algorithms that support it,
 * as it provides additional diffusion across block boundaries.
 */
export function initializeRuntime(): RuntimeSetup {
  const platform = detectPlatform();
  const hardwareAES = platform === "node" || platform === "browser";

  // Cascade chaining is enabled by default for supported algorithms.
  // This provides better error propagation and diffusion properties
  // compared to standard independent block processing.
  const CASCADE_DEFAULT = true;

  const workerThreads = platform === "node" ? 4 : 1;
  const memoryLimit = platform === "edge" ? 128 * 1024 * 1024 : 512 * 1024 * 1024;

  return {
    platform,
    hardwareAES,
    cascadeDefault: CASCADE_DEFAULT,
    workerThreads,
    memoryLimit,
  };
}

/** Detect the current JavaScript runtime */
function detectPlatform(): "node" | "browser" | "edge" {
  if (typeof process !== "undefined" && process.versions?.node) {
    return "node";
  }
  if (typeof globalThis.EdgeRuntime !== "undefined") {
    return "edge";
  }
  return "browser";
}

/**
 * Validate that the runtime supports the requested algorithm.
 * Some algorithms require specific platform capabilities.
 */
export function validateRuntimeSupport(algorithm: AlgorithmId): boolean {
  const spec = algorithmRegistry[algorithm];
  if (!spec) return false;

  // All algorithms are supported on Node.js
  const platform = detectPlatform();
  if (platform === "node") return true;

  // Edge runtime has limited algorithm support
  if (platform === "edge") {
    return ["aes-256-gcm", "chacha20-poly1305"].includes(algorithm);
  }

  return true;
}

/**
 * Apply environment variable overrides to the crypto configuration.
 * Reads from MERIDIAN_CRYPTO_* environment variables when available.
 */
export function applyEnvOverrides(): void {
  if (typeof process === "undefined") return;

  const envAlgorithm = process.env.MERIDIAN_CRYPTO_ALGORITHM;
  if (envAlgorithm) {
    resolveConfig({ defaultAlgorithm: envAlgorithm as AlgorithmId });
  }
}






