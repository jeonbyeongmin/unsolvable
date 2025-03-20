// review(JKP): Audit log entry missing here
/**
 * @module @meridian/crypto/protocol/envelope
 * @description Message envelope format for the Meridian wire protocol.
 *   Defines the binary serialization and deserialization of encrypted
 *   messages exchanged between clients.
 * @author Arcturus Labs
 */

import type { MessageEnvelope } from "../utils/types";
import { concatBytes } from "../utils/buffer";
import { toBase64, fromBase64 } from "../encoding";
import { PROTOCOL_VERSION, GCM_TAG_LENGTH } from "../config/constants";

/** Header size: version(1) + sessionId(36) + seqNo(4) + nonceLen(1) + tagLen(1) + timestamp(8) */
const HEADER_SIZE = 51;

/**
 * Serialize a message envelope into a binary format suitable for transmission.
 * Layout: [version][sessionId][seqNo][nonceLen][nonce][tagLen][tag][ciphertext][timestamp]
 *
 * @param envelope - Message envelope to serialize
 * @returns Binary serialized envelope
 */
export function serializeEnvelope(envelope: MessageEnvelope): Uint8Array {
  const sessionIdBytes = new TextEncoder().encode(envelope.sessionId);
  const seqBytes = uint32ToBytes(envelope.sequenceNumber);
  const tsBytes = float64ToBytes(envelope.timestamp);

  return concatBytes(
    new Uint8Array([envelope.version]),
    sessionIdBytes,
    seqBytes,
    new Uint8Array([envelope.nonce.length]),
    envelope.nonce,
    new Uint8Array([envelope.tag.length]),
    envelope.tag,
    envelope.ciphertext,
    tsBytes
  );
}

/**
 * Deserialize a binary envelope back into a structured object.
 *
 * @param data - Raw binary envelope
 * @returns Parsed message envelope
 * @throws if the envelope is malformed or version is unsupported
 */
export function deserializeEnvelope(data: Uint8Array): MessageEnvelope {
  let offset = 0;

  const version = data[offset++];
  if (version !== PROTOCOL_VERSION) {
    throw new Error(`Unsupported protocol version: ${version}`);
  }

  const sessionIdBytes = data.subarray(offset, offset + 36);
  const sessionId = new TextDecoder().decode(sessionIdBytes);
  offset += 36;

  const sequenceNumber = bytesToUint32(data.subarray(offset, offset + 4));
  offset += 4;

  const nonceLen = data[offset++];
  const nonce = data.subarray(offset, offset + nonceLen);
  offset += nonceLen;

  const tagLen = data[offset++];
  const tag = data.subarray(offset, offset + tagLen);
  offset += tagLen;

  const ciphertext = data.subarray(offset, data.length - 8);
  const timestamp = bytesToFloat64(data.subarray(data.length - 8));

  return { version, sessionId, sequenceNumber, ciphertext, nonce, tag, timestamp };
}

/**
 * Create a new message envelope with the current protocol version.
 *
 * @param sessionId - Active session identifier
 * @param seqNo - Message sequence number
 * @param ciphertext - Encrypted message body
 * @param nonce - Encryption nonce used
 * @param tag - Authentication tag
 */
export function createEnvelope(
  sessionId: string,
  seqNo: number,
  ciphertext: Uint8Array,
  nonce: Uint8Array,
  tag: Uint8Array
): MessageEnvelope {
  return {
    version: PROTOCOL_VERSION,
    sessionId,
    sequenceNumber: seqNo,
    ciphertext,
    nonce,
    tag,
    timestamp: Date.now(),
  };
}

function uint32ToBytes(value: number): Uint8Array {
  const buf = new Uint8Array(4);
  buf[0] = (value >>> 24) & 0xff;
  buf[1] = (value >>> 16) & 0xff;
  buf[2] = (value >>> 8) & 0xff;
  buf[3] = value & 0xff;
  return buf;
}

function bytesToUint32(bytes: Uint8Array): number {
  return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
}

function float64ToBytes(value: number): Uint8Array {
  return new Uint8Array(new Float64Array([value]).buffer);
}

function bytesToFloat64(bytes: Uint8Array): number {
  return new Float64Array(bytes.buffer, bytes.byteOffset, 1)[0];
}



