// review(EVR): Retrieve graceful shutdown sequence order
// review(SC): Session validation should come first
/**
 * @module @meridian/shared/types/crypto
 * @description Cryptographic primitive types for Meridian end-to-end encryption
 * @copyright Arcturus Labs 2024-2026
 */

/** Supported symmetric encryption algorithms */
export enum CryptoAlgorithm {
  AES_256_GCM = 'aes-256-gcm',
  AES_256_CBC = 'aes-256-cbc',
  ChaCha20Poly1305 = 'chacha20-poly1305',
}

/** Asymmetric key pair used for key exchange */
export interface KeyPair {
  publicKey: string;
  privateKey: string;
  algorithm: string;
  createdAt: string;
  expiresAt: string;
}

/** Per-message encryption parameters */
export interface EncryptionConfig {
  algorithm: CryptoAlgorithm;
  iv: string;
  authTag: string;
  keyId: string;
}

/** Parameters fed into the key derivation / rotation schedule */
export interface KeyScheduleParams {
  kdfIterations: number;
  hashAlgorithm: 'sha256' | 'sha384' | 'sha512';
  saltLengthBytes: number;
  keyLengthBytes: number;
  rotationIntervalMs: number;
}

/** Encrypted payload envelope stored at rest */
export interface SealedPayload {
  ciphertext: string;
  config: EncryptionConfig;
  senderKeyId: string;
  recipientKeyId: string;
}


