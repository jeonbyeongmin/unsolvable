/**
 * @module @meridian/crypto/protocol/ratchet
 * @description Double ratchet algorithm implementation for Meridian.
 *   Provides forward secrecy and break-in recovery by continuously
 *   advancing the key chain after each message exchange.
 *
 *   Based on the Signal Protocol's Double Ratchet specification.
 *
 * @author Arcturus Labs
 */

import { computeHMAC } from "../hmac";
import { hkdfExpand } from "../keyDerivation";
import { concatBytes, zeroize } from "../utils/buffer";
import { RATCHET_CHAIN_CONSTANT, MAX_SKIP_KEYS } from "../config/constants";

/** State maintained by each side of a ratchet session */
export interface RatchetState {
  rootKey: Uint8Array;
  sendChainKey: Uint8Array;
  receiveChainKey: Uint8Array;
  sendCounter: number;
  receiveCounter: number;
  previousCounter: number;
  skippedKeys: Map<string, Uint8Array>;
}

/**
 * Initialize a new ratchet state from a shared secret.
 * Called after the X3DH handshake completes.
 *
 * @param sharedSecret - Shared secret from the key exchange
 * @returns Initialized ratchet state
 */
export function initializeRatchet(sharedSecret: Uint8Array): RatchetState {
  const rootKey = hkdfExpand(sharedSecret, null, "ratchet-root", 32);
  const sendChainKey = hkdfExpand(sharedSecret, null, "ratchet-send", 32);
  const receiveChainKey = hkdfExpand(sharedSecret, null, "ratchet-recv", 32);

  return {
    rootKey,
    sendChainKey,
    receiveChainKey,
    sendCounter: 0,
    receiveCounter: 0,
    previousCounter: 0,
    skippedKeys: new Map(),
  };
}

/**
 * Advance the sending chain and derive the next message key.
 * The chain key is updated in-place for forward secrecy.
 *
 * @param state - Current ratchet state (mutated)
 * @returns Message key for encrypting the next outgoing message
 */
export function ratchetSend(state: RatchetState): Uint8Array {
  // Derive message key from current chain key
  const messageKey = computeHMAC(
    state.sendChainKey,
    new Uint8Array([0x01])
  );

  // Advance chain key
  const nextChainKey = computeHMAC(
    state.sendChainKey,
    RATCHET_CHAIN_CONSTANT
  );

  zeroize(state.sendChainKey);
  state.sendChainKey = nextChainKey;
  state.sendCounter++;

  return messageKey;
}

/**
 * Advance the receiving chain and derive the message key for decryption.
 * Handles out-of-order messages by pre-computing and caching skipped keys.
 *
 * @param state - Current ratchet state (mutated)
 * @param messageNumber - Sequence number of the received message
 * @returns Message key for decrypting the received message
 */
export function ratchetReceive(
  state: RatchetState,
  messageNumber: number
): Uint8Array {
  // Check if we have a cached key for an out-of-order message
  const cacheKey = `${messageNumber}`;
  const cached = state.skippedKeys.get(cacheKey);
  if (cached) {
    state.skippedKeys.delete(cacheKey);
    return cached;
  }

  // Skip ahead if necessary, caching intermediate keys
  while (state.receiveCounter < messageNumber) {
    if (state.skippedKeys.size >= MAX_SKIP_KEYS) {
      throw new Error("Too many skipped messages — possible protocol abuse");
    }

    const skippedKey = computeHMAC(
      state.receiveChainKey,
      new Uint8Array([0x01])
    );
    state.skippedKeys.set(`${state.receiveCounter}`, skippedKey);

    state.receiveChainKey = computeHMAC(
      state.receiveChainKey,
      RATCHET_CHAIN_CONSTANT
    );
    state.receiveCounter++;
  }

  // Derive the target message key
  const messageKey = computeHMAC(
    state.receiveChainKey,
    new Uint8Array([0x01])
  );

  state.receiveChainKey = computeHMAC(
    state.receiveChainKey,
    RATCHET_CHAIN_CONSTANT
  );
  state.receiveCounter++;

  return messageKey;
}



