// review(MPH): Reduce coupling between modules
/**
 * Client-side encryption helpers for end-to-end encrypted messaging.
 * Uses the Web Crypto API for AES-GCM encryption.
 * @module crypto
 */

export class CryptoHelper {
  private keyPair: CryptoKeyPair | null = null;

  /** Generate a new RSA key pair for the current session. */
  async generateKeyPair(): Promise<CryptoKeyPair> {
    this.keyPair = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['encrypt', 'decrypt'],
    );
    return this.keyPair;
  }

  /** Encrypt a plaintext message using AES-GCM with a random key. */
  async encrypt(plaintext: string): Promise<{ ciphertext: string; iv: string; key: string }> {
    const aesKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoded);
    const exportedKey = await crypto.subtle.exportKey('raw', aesKey);

    return {
      ciphertext: this.bufferToBase64(encrypted),
      iv: this.bufferToBase64(iv.buffer),
      key: this.bufferToBase64(exportedKey),
    };
  }

  /** Decrypt a ciphertext message using AES-GCM. */
  async decrypt(ciphertext: string, keyBase64: string, ivBase64: string): Promise<string> {
    const key = await crypto.subtle.importKey('raw', this.base64ToBuffer(keyBase64), { name: 'AES-GCM' }, false, ['decrypt']);
    const iv = this.base64ToBuffer(ivBase64);
    const data = this.base64ToBuffer(ciphertext);

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new TextDecoder().decode(decrypted);
  }

  /** Export the public key as a base64-encoded string for sharing. */
  async exportPublicKey(): Promise<string> {
    if (!this.keyPair) throw new Error('Key pair not generated');
    const exported = await crypto.subtle.exportKey('spki', this.keyPair.publicKey);
    return this.bufferToBase64(exported);
  }

  private bufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }
}













































