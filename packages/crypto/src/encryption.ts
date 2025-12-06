/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/stryke.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import {
  base64StringToUint8Array,
  concatUint8Array,
  stringToUtf8Array,
  uint8ArrayToString,
  utf8ArrayToString
} from "@stryke/convert/neutral";
import { decodeBase64, encodeBase64 } from "./base-64";
import { decodeHex, encodeHex } from "./hex";

/**
 * Creates a CryptoKey object that can be used to encrypt any string.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
 *
 * @returns A promise that resolves to a CryptoKey object that can be used to encrypt and decrypt strings.
 */
export async function createKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encodes a CryptoKey to base64 string, so that it can be embedded in JSON / JavaScript
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey
 *
 * @param key - The CryptoKey to encode
 * @returns A promise that resolves to a base64 string representing the key
 */
export async function encodeKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key);

  return encodeBase64(new Uint8Array(exported)).toString();
}

/**
 * Decodes a base64 string into bytes and then imports the key.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
 *
 * @param encoded - The base64 encoded key
 * @returns A promise that resolves to a CryptoKey object that can be used to encrypt and decrypt strings
 */
export async function decodeKey(encoded: string): Promise<CryptoKey> {
  const bytes = decodeBase64(encoded);

  return crypto.subtle.importKey(
    "raw",
    bytes.buffer as ArrayBuffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
}

// The length of the initialization vector
// See https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
const IV_LENGTH = 24;

/**
 * Using a CryptoKey, use AES-GCM to encrypt a string into a base64 string.
 *
 * @remarks
 * The initialization vector is randomly generated and prepended to the encrypted string. The IV is required for decryption, so it must be stored alongside the encrypted data.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
 *
 * @param key - The CryptoKey to use for encryption
 * @param plaintext - The plaintext string to encrypt
 * @returns A promise that resolves to a base64 string representing the encrypted data
 */
export async function encrypt(
  key: CryptoKey,
  plaintext: string
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH / 2));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as Uint8Array<ArrayBuffer>
    },
    key,
    stringToUtf8Array(plaintext) as BufferSource
  );

  // iv is 12, hex brings it to 24
  return encodeHex(iv) + encodeBase64(new Uint8Array(encrypted));
}

/**
 * Takes a base64 encoded string, decodes it and returns the AES-GCM decrypted text.
 *
 * @remarks
 * The initialization vector is expected to be prepended to the encrypted string. The IV is required for decryption, so it must be extracted from the start of the string.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
 *
 * @param key - The CryptoKey to use for decryption
 * @param encrypted - The encrypted base64 encoded string to decrypt
 * @returns A promise that resolves to the decrypted string
 */
export async function decrypt(
  key: CryptoKey,
  encrypted: string
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: decodeHex(encrypted.slice(0, IV_LENGTH)) as Uint8Array<ArrayBuffer>
    },
    key,
    decodeBase64(encrypted.slice(IV_LENGTH)) as BufferSource
  );

  return utf8ArrayToString(decrypted);
}

/**
 * Encrypts a buffer using AES-GCM with a given CryptoKey.
 *
 * @remarks
 * The initialization vector (IV) is randomly generated and prepended to the encrypted data. The resulting data is then encoded as a base64 string for easy storage/transmission.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
 *
 * @param key - The CryptoKey to use for encryption
 * @param buffer - The buffer to encrypt
 * @returns A promise that resolves to a base64 string representing the encrypted data
 */
export async function encryptBuffer(
  key: CryptoKey,
  buffer: BufferSource
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    buffer
  );

  return uint8ArrayToString(concatUint8Array([iv, new Uint8Array(encrypted)]));
}

/**
 * Decrypts a buffer using AES-GCM with a given CryptoKey.
 *
 * @remarks
 * The initialization vector (IV) is expected to be prepended to the encrypted data. The IV is required for decryption, so it must be extracted from the start of the buffer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
 *
 * @param key - The CryptoKey to use for decryption
 * @param encrypted - The encrypted base64 encoded string to decrypt
 * @returns A promise that resolves to the decrypted string
 */
export async function decryptBuffer(
  key: CryptoKey,
  encrypted: string
): Promise<ArrayBuffer> {
  const concatenated = base64StringToUint8Array(encrypted);

  return crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: concatenated.slice(0, 16)
    },
    key,
    concatenated.slice(16)
  );
}
