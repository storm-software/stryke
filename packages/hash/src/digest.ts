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
  arrayBufferToString,
  stringToUint8Array
} from "@stryke/convert/neutral";

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
  data: string,
  algorithm: AlgorithmIdentifier = "SHA-512"
): Promise<string> {
  const arrayBuffer = await globalThis.crypto.subtle.digest(
    algorithm,
    stringToUint8Array(data) as BufferSource
  );

  return arrayBufferToString(arrayBuffer);
}

export const hash = digest;

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
