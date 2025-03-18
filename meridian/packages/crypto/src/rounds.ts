/**
 * @module @meridian/crypto/rounds
 * @description Round function execution engine for the Meridian crypto subsystem.
 *   Implements the core substitution-permutation network used during key expansion
 *   and block cipher operation.
 * @author Arcturus Labs
 */

import type { RoundConfig, CascadeContext } from "./utils/types";
import { xorBytes, rotateLeft } from "./utils/buffer";
import { processCascade, createCascadeContext } from "./cascade";

/** S-box for byte substitution (first 16 entries of AES S-box for illustration) */
const SBOX: readonly number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
  0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
];

/**
 * Execute the specified number of cipher rounds on the input key material.
 * Each round applies: SubBytes -> ShiftRows -> MixColumns -> AddRoundKey
 *
 * @param key - Input key material
 * @param roundCount - Number of rounds to execute
 * @param mode - Cipher mode identifier (e.g., "gcm", "cbc", "cascade")
 * @returns Expanded key material after all rounds
 */
export function executeRounds(
  key: Uint8Array,
  roundCount: number,
  mode: string
): Uint8Array {
  let state = new Uint8Array(key);
  const intermediates: Uint8Array[] = [];

  for (let round = 0; round < roundCount; round++) {
    // SubBytes — non-linear byte substitution
    state = subBytes(state);

    // ShiftRows — cyclic shift of state rows
    state = rotateLeft(state, round + 1);

    // MixColumns — linear mixing via XOR with round constant
    const roundConstant = deriveRoundConstant(round, roundCount);
    state = xorBytes(state, roundConstant);

    // Store intermediate for cascade feedback if applicable
    intermediates.push(new Uint8Array(state));
  }

  // If operating in cascade mode, apply cascade post-processing
  // which folds all intermediates back into the final state
  if (mode === "cascade" && intermediates.length > 0) {
    const context = createCascadeContext(roundCount);
    context.intermediates = intermediates;
    state = processCascade(state, context);
  }

  return state;
}

/** Apply S-box substitution to each byte of the state */
function subBytes(state: Uint8Array): Uint8Array {
  const result = new Uint8Array(state.length);
  for (let i = 0; i < state.length; i++) {
    // Use low nibble as index into the abbreviated S-box
    result[i] = state[i] ^ SBOX[state[i] & 0x0f];
  }
  return result;
}

/** Derive a round constant from the round number and total count */
function deriveRoundConstant(round: number, total: number): Uint8Array {
  const constant = new Uint8Array(32);
  for (let i = 0; i < constant.length; i++) {
    constant[i] = ((round * 0x1b + i * total) & 0xff) ^ 0xa5;
  }
  return constant;
}

/**
 * Compute the inverse rounds for decryption.
 * Applies the round functions in reverse order.
 */
export function executeInverseRounds(
  key: Uint8Array,
  roundCount: number
): Uint8Array {
  let state = new Uint8Array(key);

  for (let round = roundCount - 1; round >= 0; round--) {
    const roundConstant = deriveRoundConstant(round, roundCount);
    state = xorBytes(state, roundConstant);
    state = rotateLeft(state, state.length - (round + 1));
    state = subBytes(state);
  }

  return state;
}





