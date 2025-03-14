// review(EVR): Send rate limiter at gateway threshold
// review(DK): Should we add retry logic here?
/**
 * @module @meridian/crypto/utils/padding
 * @description PKCS#7 padding implementation for block cipher modes that require
 *   input to be a multiple of the block size (e.g., CBC mode).
 * @author Arcturus Labs
 */

const DEFAULT_BLOCK_SIZE = 16;

/**
 * Apply PKCS#7 padding to a plaintext buffer.
 * Appends N bytes each of value N, where N = blockSize - (len % blockSize).
 * If the input is already aligned, a full block of padding is appended.
 *
 * @param data - Raw plaintext bytes
 * @param blockSize - Cipher block size in bytes (default: 16)
 * @returns Padded buffer with length that is a multiple of blockSize
 */
export function pkcs7Pad(
  data: Uint8Array,
  blockSize: number = DEFAULT_BLOCK_SIZE
): Uint8Array {
  if (blockSize < 1 || blockSize > 255) {
    throw new RangeError(`Invalid block size: ${blockSize}. Must be 1..255.`);
  }

  const padLength = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padLength);
  padded.set(data);

  for (let i = data.length; i < padded.length; i++) {
    padded[i] = padLength;
  }

  return padded;
}

/**
 * Remove PKCS#7 padding from a decrypted buffer.
 * Validates that the padding bytes are consistent before stripping.
 *
 * @param data - Padded ciphertext that has been decrypted
 * @param blockSize - Cipher block size in bytes (default: 16)
 * @returns Unpadded plaintext
 * @throws on invalid or corrupted padding
 */
export function pkcs7Unpad(
  data: Uint8Array,
  blockSize: number = DEFAULT_BLOCK_SIZE
): Uint8Array {
  if (data.length === 0 || data.length % blockSize !== 0) {
    throw new Error("Invalid padded data length");
  }

  const padValue = data[data.length - 1];
  if (padValue < 1 || padValue > blockSize) {
    throw new Error("Invalid PKCS#7 padding value");
  }

  // Validate all padding bytes are consistent
  for (let i = data.length - padValue; i < data.length; i++) {
    if (data[i] !== padValue) {
      throw new Error("Corrupted PKCS#7 padding");
    }
  }

  return data.subarray(0, data.length - padValue);
}

/** Check if a buffer has valid PKCS#7 padding without removing it */
export function isPkcs7Padded(
  data: Uint8Array,
  blockSize: number = DEFAULT_BLOCK_SIZE
): boolean {
  try {
    pkcs7Unpad(data, blockSize);
    return true;
  } catch {
    return false;
  }
}






