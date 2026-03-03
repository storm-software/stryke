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

import { isSetString } from "@stryke/type-checks";

export type AlgorithmIdentifier = "SHA-256" | "SHA-384" | "SHA-512";

/**
 * Creates a new hash object for the specified algorithm.
 *
 * @param algorithm - The algorithm to use for the hash.
 * @returns A new hash object.
 */
export function createHasher(algorithm: AlgorithmIdentifier): Hasher {
  return new Hasher(algorithm);
}

/**
 * Creates a new hash object for the specified algorithm.
 *
 * @remarks
 * This function uses the Web Crypto API to create a hash of the input data.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 *
 * @param data - The data to hash.
 * @param algorithm - The algorithm to use for the hash.
 * @returns A hash string representation of the `data` parameter.
 */
export async function digest(
  data: string | Uint8Array,
  algorithm: AlgorithmIdentifier = "SHA-512"
): Promise<string> {
  const encoder = new TextEncoder();
  const arrayBuffer = await globalThis.crypto.subtle.digest(
    algorithm,
    (isSetString(data) ? encoder.encode(data) : data) as BufferSource
  );

  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Alias for {@link digest}.
 */
export const hash = digest;

/**
 * Hash a string or Uint8Array using SHA-256 and return the result as a base64url-encoded string.
 *
 * @param data - The data to hash.
 * @returns A hash string representation of the `data` parameter.
 */
export const sha256 = async (data: string | Uint8Array) =>
  digest(data, "SHA-256");

/**
 * Hash a string or Uint8Array using SHA-384 and return the result as a base64url-encoded string.
 *
 * @param data - The data to hash.
 * @returns A hash string representation of the `data` parameter.
 */
export const sha384 = async (data: string | Uint8Array) =>
  digest(data, "SHA-384");

/**
 * Hash a string or Uint8Array using SHA-512 and return the result as a base64url-encoded string.
 *
 * @param data - The data to hash.
 * @returns A hash string representation of the `data` parameter.
 */
export const sha512 = async (data: string | Uint8Array) =>
  digest(data, "SHA-512");

export class Hasher {
  #chunks: Uint8Array[] = [];

  #algorithm: AlgorithmIdentifier;

  constructor(algorithm: AlgorithmIdentifier) {
    this.#algorithm = algorithm;
  }

  update(data: Uint8Array): void {
    this.#chunks.push(data);
  }

  async digest(): Promise<Uint8Array> {
    const data = new Uint8Array(
      this.#chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    );
    let offset = 0;
    for (const chunk of this.#chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    const arrayBuffer = await globalThis.crypto.subtle.digest(
      this.#algorithm,
      data
    );

    return new Uint8Array(arrayBuffer);
  }
}
