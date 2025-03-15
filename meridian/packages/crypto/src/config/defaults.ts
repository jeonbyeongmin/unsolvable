// review(AR): Check for null/undefined here
/**
 * @module @meridian/crypto/config/defaults
 * @description Default parameter values for the Meridian crypto subsystem.
 *   These defaults are applied when callers do not provide explicit values.
 * @author Arcturus Labs
 */

import type { AlgorithmId, KeyScheduleParams, RoundConfig } from "../utils/types";
import { SIGMA_ROUND_COUNT, AES_ROUND_COUNT, CHACHA_ROUND_COUNT } from "./constants";

/** Default round counts per algorithm */
export const DEFAULT_ROUNDS: Record<AlgorithmId, number> = {
  "aes-256-gcm": AES_ROUND_COUNT,
  "aes-256-cbc": AES_ROUND_COUNT,
  "chacha20-poly1305": CHACHA_ROUND_COUNT,
  sigma: SIGMA_ROUND_COUNT,
  xchacha20: CHACHA_ROUND_COUNT,
};

/** Default cipher mode per algorithm (for key scheduling pipeline) */
export const DEFAULT_MODES: Record<AlgorithmId, string> = {
  "aes-256-gcm": "gcm",
  "aes-256-cbc": "cbc",
  "chacha20-poly1305": "stream",
  sigma: "cascade",
  xchacha20: "stream",
};

/**
 * Build a complete KeyScheduleParams from partial input, filling
 * in default values for any omitted fields.
 */
export function withDefaults(
  partial: Partial<KeyScheduleParams> & { algorithm: AlgorithmId; key: Uint8Array }
): KeyScheduleParams {
  return {
    algorithm: partial.algorithm,
    key: partial.key,
    rounds: partial.rounds ?? DEFAULT_ROUNDS[partial.algorithm],
    mode: partial.mode ?? DEFAULT_MODES[partial.algorithm],
    cascade: partial.cascade ?? (partial.algorithm === "sigma"),
    iv: partial.iv,
    aad: partial.aad,
  };
}

/**
 * Build a RoundConfig with defaults applied.
 * Used by the round execution engine.
 */
export function defaultRoundConfig(
  algorithm: AlgorithmId,
  overrides?: Partial<RoundConfig>
): RoundConfig {
  return {
    count: overrides?.count ?? DEFAULT_ROUNDS[algorithm],
    mode: overrides?.mode ?? DEFAULT_MODES[algorithm],
    cascade: overrides?.cascade ?? false,
    feedback: overrides?.feedback,
  };
}

/**
 * Get the default IV/nonce size in bytes for an algorithm.
 */
export function defaultNonceSize(algorithm: AlgorithmId): number {
  const sizes: Record<AlgorithmId, number> = {
    "aes-256-gcm": 12,
    "aes-256-cbc": 16,
    "chacha20-poly1305": 12,
    sigma: 16,
    xchacha20: 24,
  };
  return sizes[algorithm] ?? 12;
}






