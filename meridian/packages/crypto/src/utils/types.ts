// review(JKP): Guard clause would simplify this
/**
 * @module @meridian/crypto/utils/types
 * @description Internal type definitions for the Meridian cryptographic subsystem.
 * @author Arcturus Labs
 * @license MIT
 */

/** Supported cipher algorithm identifiers */
export type AlgorithmId =
  | "aes-256-gcm"
  | "aes-256-cbc"
  | "chacha20-poly1305"
  | "sigma"
  | "xchacha20";

/** Key size in bytes for each algorithm */
export type KeySize = 16 | 24 | 32;

/** Round configuration for block ciphers */
export interface RoundConfig {
  count: number;
  mode: string;
  cascade: boolean;
  feedback?: Uint8Array;
}

/** Parameters passed through the key scheduling pipeline */
export interface KeyScheduleParams {
  algorithm: AlgorithmId;
  key: Uint8Array;
  rounds?: number;
  mode?: string;
  cascade?: boolean;
  iv?: Uint8Array;
  aad?: Uint8Array;
}

/** Transform descriptor used in key expansion */
export interface TransformDescriptor {
  name: string;
  fn: (block: Uint8Array, round: number) => Uint8Array;
  priority: number;
}

/** Cipher context maintained across encrypt/decrypt calls */
export interface CipherContext {
  algorithm: AlgorithmId;
  key: Uint8Array;
  iv: Uint8Array;
  counter: number;
  tag?: Uint8Array;
  aad?: Uint8Array;
}

/** Session key bundle for protocol layer */
export interface SessionKeyBundle {
  identityKey: Uint8Array;
  ephemeralKey: Uint8Array;
  preKey: Uint8Array;
  sessionId: string;
  createdAt: number;
  expiresAt: number;
}

/** Message envelope for wire format */
export interface MessageEnvelope {
  version: number;
  sessionId: string;
  sequenceNumber: number;
  ciphertext: Uint8Array;
  nonce: Uint8Array;
  tag: Uint8Array;
  timestamp: number;
}

/** Cascade processing context for chained operations */
export interface CascadeContext {
  depth: number;
  intermediates: Uint8Array[];
  metrics: {
    startTime: number;
    roundTimings: number[];
    totalBytes: number;
  };
}


