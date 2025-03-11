/**
 * Encryption service — provides E2E encryption helpers for secure messaging.
 * Uses AES-256-GCM for symmetric encryption and RSA for key exchange.
 *
 * @module services/encryptionService
 */
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class EncryptionService {
  private static instance: EncryptionService;

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /** Generate a random 256-bit symmetric key */
  generateSymmetricKey(): Buffer {
    return crypto.randomBytes(KEY_LENGTH);
  }

  /** Encrypt plaintext with a symmetric key using AES-256-GCM */
  encrypt(plaintext: string, key: Buffer): EncryptedPayload {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    return {
      ciphertext,
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
    };
  }

  /** Decrypt an encrypted payload with the corresponding symmetric key */
  decrypt(payload: EncryptedPayload, key: Buffer): string {
    const iv = Buffer.from(payload.iv, 'base64');
    const authTag = Buffer.from(payload.authTag, 'base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let plaintext = decipher.update(payload.ciphertext, 'base64', 'utf8');
    plaintext += decipher.final('utf8');
    return plaintext;
  }

  /** Generate an RSA key pair for key exchange */
  generateKeyPair(): KeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  /** Derive a shared secret using HKDF from a base key */
  deriveKey(baseKey: Buffer, salt: Buffer, info: string): Buffer {
    return crypto.hkdfSync('sha256', baseKey, salt, info, KEY_LENGTH) as unknown as Buffer;
  }
}


