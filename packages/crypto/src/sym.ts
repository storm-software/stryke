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

import { isSetString } from "@stryke/type-checks/is-set-string";
import { Buffer } from "node:buffer";
import type { BinaryLike, KeyObject } from "node:crypto";
import {
  createCipheriv,
  createDecipheriv,
  createSecretKey,
  pbkdf2Sync,
  randomBytes
} from "node:crypto";

// Background:
// https://security.stackexchange.com/questions/184305/why-would-i-ever-use-aes-256-cbc-if-aes-256-gcm-is-more-secure

const CIPHER_ALGORITHM = "chacha20-poly1305"; // `aes-256-gcm`;
const CIPHER_KEY_LENGTH = 32; // https://stackoverflow.com/a/28307668/4397028
const CIPHER_IV_LENGTH = 16; // https://stackoverflow.com/a/28307668/4397028
const CIPHER_TAG_LENGTH = 16;
const CIPHER_SALT_LENGTH = 64;

const PBKDF2_ITERATIONS = 100_000; // https://support.1password.com/pbkdf2/

/**
 * Creates and returns a new key object containing a secret key for symmetric encryption or `Hmac`.
 *
 * @param key - The key to use when creating the `KeyObject`.
 * @returns The new `KeyObject`.
 */
export function createSecret(key: NodeJS.ArrayBufferView): KeyObject;

/**
 * Creates and returns a new key object containing a secret key for symmetric encryption or `Hmac`.
 *
 * @param key - The key to use. If `key` is a `Buffer`, `TypedArray`, or `DataView`, the `encoding` argument is ignored.
 * @param encoding - The `encoding` of the `key` string. Must be one of `'utf8'`, `'utf16le'`, `'latin1'`, or `'base64'`. Default is `'utf8'`.
 * @returns The new `KeyObject`.
 */
export function createSecret(key: string, encoding: BufferEncoding): KeyObject;

/**
 * Creates and returns a new key object containing a secret key for symmetric encryption or `Hmac`.
 *
 * @param key - The key to use. If `key` is a `Buffer`, `TypedArray`, or `DataView`, the `encoding` argument is ignored.
 * @param encoding - The `encoding` of the `key` string. Must be one of `'utf8'`, `'utf16le'`, `'latin1'`, or `'base64'`. Default is `'utf8'`.
 * @returns The new `KeyObject`.
 */
export function createSecret(
  key: string | NodeJS.ArrayBufferView,
  encoding?: BufferEncoding
): KeyObject {
  return isSetString(key)
    ? createSecretKey(key, encoding!)
    : createSecretKey(key);
}

/**
 * Encrypts data using a secret.
 *
 * @param secret - The secret key used for encryption.
 * @param data - The data to encrypt.
 * @returns The encrypted data.
 */
export function encryptWithSecret(secret: BinaryLike, data: string): string {
  const iv = randomBytes(CIPHER_IV_LENGTH);
  const salt = randomBytes(CIPHER_SALT_LENGTH);

  // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
  const key = pbkdf2Sync(
    secret,
    salt,
    PBKDF2_ITERATIONS,
    CIPHER_KEY_LENGTH,
    `sha512`
  );

  const cipher = createCipheriv(CIPHER_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final()
  ]);

  // https://nodejs.org/api/crypto.html#crypto_cipher_getauthtag
  const tag = cipher.getAuthTag();

  return Buffer.concat([
    // Data as required by: https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options
    salt, // Salt for Key: https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    iv, // IV: https://nodejs.org/api/crypto.html#crypto_class_decipher
    tag, // Tag: https://nodejs.org/api/crypto.html#crypto_decipher_setauthtag_buffer
    encrypted
  ]).toString("hex");
}

/**
 * Decrypts data using a secret.
 *
 * @param secret - The secret key used for decryption.
 * @param encryptedData - The encrypted data to decrypt.
 * @returns The decrypted data.
 */
export function decryptWithSecret(
  secret: BinaryLike,
  encryptedData: string
): string {
  const buffer = Buffer.from(encryptedData, "hex");

  const salt = buffer.slice(0, CIPHER_SALT_LENGTH);
  const iv = buffer.slice(
    CIPHER_SALT_LENGTH,
    CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH
  );
  const tag = buffer.slice(
    CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH,
    CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH + CIPHER_TAG_LENGTH
  );
  const encrypted = buffer.slice(
    CIPHER_SALT_LENGTH + CIPHER_IV_LENGTH + CIPHER_TAG_LENGTH
  );

  // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
  const key = pbkdf2Sync(
    secret,
    salt,
    PBKDF2_ITERATIONS,
    CIPHER_KEY_LENGTH,
    `sha512`
  );

  const decipher = createDecipheriv(CIPHER_ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  // eslint-disable-next-line ts/restrict-plus-operands
  return decipher.update(encrypted) + decipher.final("utf8");
}
