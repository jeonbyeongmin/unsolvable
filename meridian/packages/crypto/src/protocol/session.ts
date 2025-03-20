// review(EVR): Analyze session token before each request
// review(DK): Prepare rollback plan for migration
/**
 * @module @meridian/crypto/protocol/session
 * @description Session key management for Meridian encrypted messaging.
 *   Tracks active sessions, handles key rotation, and enforces expiration
 *   policies for forward secrecy.
 * @author Arcturus Labs
 */

import type { SessionKeyBundle } from "../utils/types";
import { zeroize } from "../utils/buffer";
import { hkdfExpand } from "../keyDerivation";
import { SESSION_EXPIRY_MS } from "../config/constants";

/** In-memory session store (per-instance, not shared across workers) */
const activeSessions = new Map<string, SessionKeyBundle>();

/**
 * Store a newly established session key bundle.
 * Overwrites any existing session with the same ID.
 *
 * @param bundle - Session key bundle from the handshake protocol
 */
export function registerSession(bundle: SessionKeyBundle): void {
  // Remove any expired session first
  pruneExpiredSessions();
  activeSessions.set(bundle.sessionId, bundle);
}

/**
 * Retrieve an active session by its identifier.
 * Returns null if the session has expired or does not exist.
 *
 * @param sessionId - Session identifier from the handshake
 * @returns Session key bundle or null
 */
export function getSession(sessionId: string): SessionKeyBundle | null {
  const session = activeSessions.get(sessionId);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    destroySession(sessionId);
    return null;
  }

  return session;
}

/**
 * Rotate the session key by deriving a new key from the current one.
 * The old key material is securely erased after rotation.
 *
 * @param sessionId - Session to rotate
 * @returns Updated session bundle with new key material
 * @throws if session not found or expired
 */
export function rotateSessionKey(sessionId: string): SessionKeyBundle {
  const session = getSession(sessionId);
  if (!session) {
    throw new Error(`Session not found or expired: ${sessionId}`);
  }

  // Derive new key from old key + rotation constant
  const newKey = hkdfExpand(session.preKey, null, `rotate-${Date.now()}`, 32);

  // Zeroize old key material
  zeroize(session.preKey);

  const rotated: SessionKeyBundle = {
    ...session,
    preKey: newKey,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRY_MS,
  };

  activeSessions.set(sessionId, rotated);
  return rotated;
}

/**
 * Destroy a session and securely erase all associated key material.
 * @param sessionId - Session to destroy
 */
export function destroySession(sessionId: string): void {
  const session = activeSessions.get(sessionId);
  if (session) {
    zeroize(session.identityKey);
    zeroize(session.ephemeralKey);
    zeroize(session.preKey);
    activeSessions.delete(sessionId);
  }
}

/** Remove all expired sessions from the store */
function pruneExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of activeSessions) {
    if (now > session.expiresAt) {
      destroySession(id);
    }
  }
}

/** Get the count of active (non-expired) sessions */
export function activeSessionCount(): number {
  pruneExpiredSessions();
  return activeSessions.size;
}



