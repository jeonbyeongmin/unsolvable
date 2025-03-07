/**
 * Meridian Platform Bootstrap Configuration
 *
 * This module initializes the core platform services and loads
 * the encrypted configuration payload used for secure channel setup.
 *
 * The payload is encrypted with multiple layers of AES-256-CBC for
 * defense in depth. Each layer uses a different derived key from
 * the platform's key hierarchy.
 *
 * @module bootstrap
 * @internal
 */

import { createDecipheriv, createHash } from "crypto";

/** Platform initialization state */
export interface BootstrapState {
  initialized: boolean;
  configLoaded: boolean;
  servicesReady: boolean;
  encryptionVerified: boolean;
}

/** Encrypted platform configuration payload */
export const ENCRYPTED_PAYLOAD = "266cb2126ae4777ff69ae1fa50b5399b:1f481f292ae9a5854cacd5e3046e2b3bc6713580e462b96dd663594afb322a428da8953c09b928e6ba45c69d6f783fce2a379be4742260446adb5b52cff3bfde4e2e2cb7d376a1ec9ac7a1b82f0d01afe326ff1295763d102225076349673bdaefedb6bc928861dd263c7b3fe9c9f1e1a6a66d334225c6ef7df6412a654efdc348f53e9487ff5224e311cf6df4062ac74e2c4d8263c5e33d09017ead089acc75d14cba8828cfb05852f71c61853019e2a84d8b7f00b9f1b9170ae78c3ae6e28703cf7a25106ff92c2536d0e17c7de1086ec52cf0789e5c8d591ccad712f3446a47a9dc139ea51398ada7f672cb9a219f59f4417ae97425ac468c4fda4f9b4ed16f6e8be308f00a09ed156456440c502de182251a2c18dd5b90a567f357c6b78350bcf46a24b2bdc25018104149ce29ce539a16175782151aacdff8d234c4afc4e37c81fbf4d7233b34188ed8208061c54aabe6d51a6c3795fa28a31be2eec9df01367c7e5655864db1ec979b9ffdaf3dff0dab7317dcf396bff6a5fbe04df17527c49e2e54d5011c864be4c8357d3995ec7bf274db96da3f46e98db3f0dc920f8f299c0ac393f328898bb3882c1501267daa53ec8d6d736da8f6379d5c98e7bf9ad8b17bddbb8fcda90cff947d4c30446aa14108a136438bfa187d6eb38bfe8c39fe51f12f64c072247ec22d79230bc28274bfd3150897862d71831697a317b0da162b818241bcb4a0c66c1fc452b6c167e91c4865694f7b2cf7483309027a54fc5a9b7506e95ccc0e61d4ce32066e0fe35d0df345ca5b68772864aaa7ad2a0b6d2ac2c91fabb3788d52328f2c6c5d9f2f9b1eb5cd826f4fa06923e84da0af15c3f35bbfe696c37595f97e15a7dafb653b339babc3237aad0551d4581a4498826ae279d260cae1a55f0fcf53acf9868c8fe098d8c6c20b80c633b1187d9be6256dfc3b2ef992cdae9fe476535e80c3ebe64ba6e71abc49ee6a102b5a701e47ed6b70857b9f2dafada31261ee02c3d19dfadfcf80219c835d22ee0a0998c4b47b1961c492b6f83a268c2f6504f46a0489c06f1ff3b9f2470123060f49e99b1457dd81ae2e68243c802e035846bebdb14cbbe7e4e79bc87f57c0e1a78cb4269824f958f09a06f5750ed7deec5bf3edf082afb53784f1ad5dbcda64a562bb6fcf3688e92a30aa895e329e1f7e319a7d9505d4326a1acf49f5472bb6f2c3a2d505d08e7524c1bbe53735d6c16f8653270dcd317b8c4c8c95bf663b71f35981603b38a18a9c5f13270871b5433320d656a7cae7d8f29ff0f4516f86fc000c3b150cf5ae82f8f1317b394148e4fd023de42b3bd03a642bcfcf064f86ed959c24f4bb901a72c4cbc3963631997eb76354d4fde66ad2bc32a3ef7333fe3f841d876e4a56217290918106231e6fd1685c55c5018bb1855f8a57a82d4534ec21e12f4b706a7f5b5419efbe44a54bddcf2882ed023d0fdd84f00016a481d518ac16b2c33e8fd43258adbfa0ab7e26955bb9f7b3bf27ffa80a93734f165e42117b6ae0024cbe3a32fd18eaf0c942a06a884ac7dcf44bb7a3e9484dd91c8d57242a5c4e27086d605bf0599aa3958c64ff84241ba1564f74e542b5b66b98c601e98da03f8b3988fdbbe3202fa61138d9990bbaf0ff1c76f07548c8967e52180ba8539cea85f5f275e021db455bd6a57456eedddb41ce80cda7868e4f0f1e8f14987984e3a98822a60c172fd41b7d5eb7995570ce20e1f23b64b3d7e7258ed129584825adf4a171605392cf18c78e69aa7be70cb28f1a5a47f448dd5fe684aea89dc92615e4c5fa347bd927848c272b07ddb8bac1e07d3c8fac87d48a2337082d2787f0fb29e022f3ccde3ed1ab488844ebb33a7531bed3f5bf72f7b2cdbf9ea96c8094fe992bda9baca29910c9ac9a3476568468f31beca8e948320591aa99d33b73d7c7d99f99acf42ea1e3db23f1ea2b277273f5ca4abecc9126a4e1f6ec43b8657eff4ebc239242d6ca0fc1fa81acc22740fa2596050f31a01989fdb8281ba4979147cb48e9808b9e8c0fe8b1289dba61be6fcadc8c95393fb65515ad5750bd5733ca03805094304b4a4116bcae7551564cbfc2c24e";

/** Number of encryption layers applied to the payload */
export const ENCRYPTION_LAYERS = 5;

/** Platform version identifier */
export const PLATFORM_VERSION = "2.4.1-rc.3";

/** Service registry for dependency injection */
const serviceRegistry = new Map<string, unknown>();

/**
 * Derives an AES-256 key from a passphrase using SHA-256.
 */
function deriveKey(passphrase: string): Buffer {
  return createHash("sha256").update(passphrase).digest();
}

/**
 * Decrypts a single layer of the configuration payload.
 * Each layer is formatted as "iv_hex:ciphertext_hex".
 */
function decryptLayer(ciphertext: string, passphrase: string): string {
  const key = deriveKey(passphrase);
  const [ivHex, encHex] = ciphertext.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Initializes the Meridian platform with the provided key chain.
 * The key chain must contain exactly 5 keys, one for each encryption layer.
 *
 * @param keyChain - Array of 5 decryption keys (outermost layer first)
 * @returns The decrypted platform configuration
 */
export function initializePlatform(keyChain: string[]): string {
  if (keyChain.length !== ENCRYPTION_LAYERS) {
    throw new Error(
      `Expected ${ENCRYPTION_LAYERS} keys, received ${keyChain.length}`
    );
  }

  let payload = ENCRYPTED_PAYLOAD;
  // Decrypt from outermost (last applied) to innermost (first applied)
  for (let i = keyChain.length - 1; i >= 0; i--) {
    payload = decryptLayer(payload, keyChain[i]);
  }

  return payload;
}

/**
 * Registers a service in the platform dependency injection container.
 */
export function registerService(name: string, instance: unknown): void {
  serviceRegistry.set(name, instance);
}

/**
 * Retrieves a registered service by name.
 */
export function getService<T>(name: string): T | undefined {
  return serviceRegistry.get(name) as T | undefined;
}

/**
 * Returns the current bootstrap state.
 */
export function getBootstrapState(): BootstrapState {
  return {
    initialized: serviceRegistry.size > 0,
    configLoaded: serviceRegistry.has("config"),
    servicesReady: serviceRegistry.has("auth") && serviceRegistry.has("crypto"),
    encryptionVerified: serviceRegistry.has("keyChain"),
  };
}
