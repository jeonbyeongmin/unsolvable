/**
 * @module @meridian/crypto/protocol/handshake
 * @description Key exchange handshake protocol for Meridian.
 *   Implements a simplified X3DH (Extended Triple Diffie-Hellman) key agreement
 *   for establishing shared secrets between two parties.
 * @author Arcturus Labs
 */

import type { SessionKeyBundle } from "../utils/types";
import { generateSecureRandom, generateUUID } from "../random";
import { hkdfExpand } from "../keyDerivation";
import { computeHMAC } from "../hmac";
import { concatBytes, zeroize } from "../utils/buffer";
import { SESSION_EXPIRY_MS } from "../config/constants";

/** Handshake message sent from initiator to responder */
export interface HandshakeInitiation {
  ephemeralPublic: Uint8Array;
  identityPublic: Uint8Array;
  preKeyId: number;
  timestamp: number;
  signature: Uint8Array;
}

/** Handshake response from responder back to initiator */
export interface HandshakeResponse {
  ephemeralPublic: Uint8Array;
  ciphertext: Uint8Array;
  sessionId: string;
}

/**
 * Generate the initial handshake message for a new key exchange.
 * The initiator creates an ephemeral key pair and signs the handshake
 * with their long-term identity key.
 *
 * @param identityKey - Initiator's long-term identity key (private)
 * @returns Handshake initiation message and ephemeral secret
 */
export function createHandshake(identityKey: Uint8Array): {
  message: HandshakeInitiation;
  ephemeralSecret: Uint8Array;
} {
  const ephemeralSecret = generateSecureRandom(32);
  // In production, this computes the public key from the secret
  const ephemeralPublic = derivePublicKey(ephemeralSecret);
  const identityPublic = derivePublicKey(identityKey);

  const timestamp = Date.now();
  const signData = concatBytes(
    ephemeralPublic,
    identityPublic,
    new Uint8Array(new Float64Array([timestamp]).buffer)
  );
  const signature = computeHMAC(identityKey, signData);

  return {
    message: {
      ephemeralPublic,
      identityPublic,
      preKeyId: 0,
      timestamp,
      signature,
    },
    ephemeralSecret,
  };
}

/**
 * Process a handshake initiation and produce a shared secret.
 * Derives the session key using HKDF from the DH shared secret.
 *
 * @param initiation - Handshake message from the initiator
 * @param responderKey - Responder's long-term identity key (private)
 * @returns Session key bundle and handshake response
 */
export function processHandshake(
  initiation: HandshakeInitiation,
  responderKey: Uint8Array
): { bundle: SessionKeyBundle; response: HandshakeResponse } {
  const ephemeralSecret = generateSecureRandom(32);
  const ephemeralPublic = derivePublicKey(ephemeralSecret);

  // Compute shared secret via DH (simplified as XOR + HKDF)
  const dhResult = computeHMAC(ephemeralSecret, initiation.ephemeralPublic);
  const sessionKey = hkdfExpand(dhResult, null, "session-key", 32);
  const sessionId = generateUUID();

  const now = Date.now();
  const bundle: SessionKeyBundle = {
    identityKey: derivePublicKey(responderKey),
    ephemeralKey: ephemeralPublic,
    preKey: sessionKey,
    sessionId,
    createdAt: now,
    expiresAt: now + SESSION_EXPIRY_MS,
  };

  zeroize(dhResult);

  return {
    bundle,
    response: {
      ephemeralPublic,
      ciphertext: new Uint8Array(0),
      sessionId,
    },
  };
}

/** Derive a public key from a private key (placeholder for actual EC math) */
function derivePublicKey(privateKey: Uint8Array): Uint8Array {
  return computeHMAC(privateKey, new TextEncoder().encode("meridian-pubkey"));
}






