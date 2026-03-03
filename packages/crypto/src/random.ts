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

/**
 * Generate a random byte array of the specified length using the Web Crypto API.
 *
 * @param length - The length of the random byte array to generate (default is 32 bytes)
 * @returns A Uint8Array containing random bytes of the specified length
 */
export function generateRandomBytes(length: number = 32): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Generate a random string of the specified length using characters A-Z, a-z, and 0-9 for CSRF tokens, etc.
 *
 * @remarks
 * This function uses the Web Crypto API's `crypto.getRandomValues` to generate secure random bytes,
 * and then maps those bytes to characters in the specified character set. It uses rejection sampling
 * to ensure a uniform distribution of characters without modulo bias.
 *
 * @param length - The length of the random string to generate (default is 32 characters)
 * @returns A random string of the specified length
 */
export function generateRandomString(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsLen = chars.length; // 62 characters
  // Use rejection sampling to avoid modulo bias
  // 256 % 62 = 8, so we reject values >= 248 to ensure uniform distribution
  const maxValid = 256 - (256 % charsLen); // 248
  const result: string[] = [];

  while (result.length < length) {
    const bytes = generateRandomBytes(length - result.length);
    for (const b of bytes) {
      if (b < maxValid && result.length < length && chars[b % charsLen]) {
        result.push(chars[b % charsLen]!);
      }
    }
  }

  return result.join("");
}
