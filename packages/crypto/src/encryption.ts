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

import { Buffer } from "node:buffer";
import crypto from "node:crypto";

// Background:
// https://security.stackexchange.com/questions/184305/why-would-i-ever-use-aes-256-cbc-if-aes-256-gcm-is-more-secure

const CIPHER_ALGORITHM = `aes-256-gcm`;
const CIPHER_KEY_LENGTH = 32; // https://stackoverflow.com/a/28307668/4397028
const CIPHER_IV_LENGTH = 16; // https://stackoverflow.com/a/28307668/4397028
const CIPHER_TAG_LENGTH = 16;
const CIPHER_SALT_LENGTH = 64;

const PBKDF2_ITERATIONS = 100_000; // https://support.1password.com/pbkdf2/

/**
 * Encrypts data using a secret.
 *
 * @param secret - The secret key used for encryption.
 * @param data - The data to encrypt.
 * @returns The encrypted data.
 */
export function encryptWithSecret(secret: Buffer, data: string): string {
  const iv = crypto.randomBytes(CIPHER_IV_LENGTH);
  const salt = crypto.randomBytes(CIPHER_SALT_LENGTH);

  // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
  const key = crypto.pbkdf2Sync(
    secret,
    salt,
    PBKDF2_ITERATIONS,
    CIPHER_KEY_LENGTH,
    `sha512`
  );

  const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(data, `utf8`),
    cipher.final()
  ]);

  // https://nodejs.org/api/crypto.html#crypto_cipher_getauthtag
  const tag = cipher.getAuthTag();

  return Buffer.concat([
    // Data as required by:
    // Salt for Key: https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    // IV: https://nodejs.org/api/crypto.html#crypto_class_decipher
    // Tag: https://nodejs.org/api/crypto.html#crypto_decipher_setauthtag_buffer
    salt,
    iv,
    tag,
    encrypted
  ]).toString(`hex`);
}

/**
 * Decrypts data using a secret.
 *
 * @param secret - The secret key used for decryption.
 * @param encryptedData - The encrypted data to decrypt.
 * @returns The decrypted data.
 */
export function decryptWithSecret(
  secret: Buffer,
  encryptedData: string
): string {
  const buffer = Buffer.from(encryptedData, `hex`);

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
  const key = crypto.pbkdf2Sync(
    secret,
    salt,
    PBKDF2_ITERATIONS,
    CIPHER_KEY_LENGTH,
    `sha512`
  );

  const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  // eslint-disable-next-line ts/restrict-plus-operands
  return decipher.update(encrypted) + decipher.final(`utf8`);
}
