/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { xxHash32 as xxHash32Base } from "js-xxhash";

/**
 * xxHash32 only computes 32-bit values. Run it n times with different seeds to
 * get a larger hash with better collision resistance.
 *
 * @param content - The string to hash
 * @param words - The number of 32-bit words to hash
 * @returns A 128-bit hash
 */
function _xxHash32(content: string, words: number): bigint {
  let hash = 0n;
  for (let i = 0; i < words; i++) {
    hash = (hash << 32n) + BigInt(xxHash32Base(content, i));
  }
  return hash;
}

export const xxHash32 = (s: string) => xxHash32Base(s, 0);
export const xxHash64 = (s: string) => _xxHash32(s, 2);
export const xxHash128 = (s: string) => _xxHash32(s, 4);
