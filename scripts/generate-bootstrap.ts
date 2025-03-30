/**
 * Generates the Stage 6 multi-layer encrypted payload for bootstrap.ts
 */

import { createCipheriv, createHash, createDecipheriv } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const FINAL_EVIDENCE = "d4e5f6a7-b8c9-4d0e-a1b2-c3d4e5f6a7b8";

const STAGE_ANSWERS = [
  "ELARA WAS HERE FIND THE ENCRYPTION KEY",
  "meridian-backdoor-sigma-7",
  "normalizeKeySchedule:sigma:7:cascade:true",
  "47.6062N-122.3321W-locker-4417",
  "james-park-ARC00142",
];

function deriveKey(password: string): Buffer {
  return createHash("sha256").update(password).digest();
}

// Deterministic IV generation: derive from layer index + salt
function deterministicIV(layerIndex: number): Buffer {
  return createHash("md5").update(`meridian-layer-${layerIndex}-iv`).digest();
}

let encryptLayer = 0;
function encrypt(plaintext: string, password: string): string {
  const key = deriveKey(password);
  const iv = deterministicIV(encryptLayer++);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(ciphertext: string, password: string): string {
  const key = deriveKey(password);
  const [ivHex, encHex] = ciphertext.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Encrypt layer by layer: stage 1 first, stage 5 last (outermost)
let payload = FINAL_EVIDENCE;
for (const answer of STAGE_ANSWERS) {
  payload = encrypt(payload, answer);
}

// Verify decryption works
let verify = payload;
for (let i = STAGE_ANSWERS.length - 1; i >= 0; i--) {
  verify = decrypt(verify, STAGE_ANSWERS[i]);
}
if (verify !== FINAL_EVIDENCE) {
  throw new Error("Encryption verification failed!");
}

const finalHash = createHash("sha256").update(FINAL_EVIDENCE.trim()).digest("hex");

console.log("Final evidence UUID:", FINAL_EVIDENCE);
console.log("Final answer hash:", finalHash);
console.log("Encrypted payload length:", payload.length);

// Write bootstrap.ts
const outDir = join(process.cwd(), "meridian/packages/shared/src");
mkdirSync(outDir, { recursive: true });

const lines = [
  '/**',
  ' * Meridian Platform Bootstrap Configuration',
  ' *',
  ' * This module initializes the core platform services and loads',
  ' * the encrypted configuration payload used for secure channel setup.',
  ' *',
  ' * The payload is encrypted with multiple layers of AES-256-CBC for',
  ' * defense in depth. Each layer uses a different derived key from',
  " * the platform's key hierarchy.",
  ' *',
  ' * @module bootstrap',
  ' * @internal',
  ' */',
  '',
  'import { createDecipheriv, createHash } from "crypto";',
  '',
  '/** Platform initialization state */',
  'export interface BootstrapState {',
  '  initialized: boolean;',
  '  configLoaded: boolean;',
  '  servicesReady: boolean;',
  '  encryptionVerified: boolean;',
  '}',
  '',
  '/** Encrypted platform configuration payload */',
  'export const ENCRYPTED_PAYLOAD = "' + payload + '";',
  '',
  '/** Number of encryption layers applied to the payload */',
  'export const ENCRYPTION_LAYERS = 5;',
  '',
  '/** Platform version identifier */',
  'export const PLATFORM_VERSION = "2.4.1-rc.3";',
  '',
  '/** Service registry for dependency injection */',
  'const serviceRegistry = new Map<string, unknown>();',
  '',
  '/**',
  ' * Derives an AES-256 key from a passphrase using SHA-256.',
  ' */',
  'function deriveKey(passphrase: string): Buffer {',
  '  return createHash("sha256").update(passphrase).digest();',
  '}',
  '',
  '/**',
  ' * Decrypts a single layer of the configuration payload.',
  ' * Each layer is formatted as "iv_hex:ciphertext_hex".',
  ' */',
  'function decryptLayer(ciphertext: string, passphrase: string): string {',
  '  const key = deriveKey(passphrase);',
  '  const [ivHex, encHex] = ciphertext.split(":");',
  '  const iv = Buffer.from(ivHex, "hex");',
  '  const decipher = createDecipheriv("aes-256-cbc", key, iv);',
  '  let decrypted = decipher.update(encHex, "hex", "utf8");',
  '  decrypted += decipher.final("utf8");',
  '  return decrypted;',
  '}',
  '',
  '/**',
  ' * Initializes the Meridian platform with the provided key chain.',
  ' * The key chain must contain exactly 5 keys, one for each encryption layer.',
  ' *',
  ' * @param keyChain - Array of 5 decryption keys (outermost layer first)',
  ' * @returns The decrypted platform configuration',
  ' */',
  'export function initializePlatform(keyChain: string[]): string {',
  '  if (keyChain.length !== ENCRYPTION_LAYERS) {',
  '    throw new Error(',
  '      `Expected ${ENCRYPTION_LAYERS} keys, received ${keyChain.length}`',
  '    );',
  '  }',
  '',
  '  let payload = ENCRYPTED_PAYLOAD;',
  '  // Decrypt from outermost (last applied) to innermost (first applied)',
  '  for (let i = keyChain.length - 1; i >= 0; i--) {',
  '    payload = decryptLayer(payload, keyChain[i]);',
  '  }',
  '',
  '  return payload;',
  '}',
  '',
  '/**',
  ' * Registers a service in the platform dependency injection container.',
  ' */',
  'export function registerService(name: string, instance: unknown): void {',
  '  serviceRegistry.set(name, instance);',
  '}',
  '',
  '/**',
  ' * Retrieves a registered service by name.',
  ' */',
  'export function getService<T>(name: string): T | undefined {',
  '  return serviceRegistry.get(name) as T | undefined;',
  '}',
  '',
  '/**',
  ' * Returns the current bootstrap state.',
  ' */',
  'export function getBootstrapState(): BootstrapState {',
  '  return {',
  '    initialized: serviceRegistry.size > 0,',
  '    configLoaded: serviceRegistry.has("config"),',
  '    servicesReady: serviceRegistry.has("auth") && serviceRegistry.has("crypto"),',
  '    encryptionVerified: serviceRegistry.has("keyChain"),',
  '  };',
  '}',
  '',
];

writeFileSync(join(outDir, "bootstrap.ts"), lines.join("\n"));
console.log("Generated meridian/packages/shared/src/bootstrap.ts");
