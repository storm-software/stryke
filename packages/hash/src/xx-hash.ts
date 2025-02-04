/*-------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/stryke
 Documentation:   https://stormsoftware.com/projects/stryke/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/stryke/license

 -------------------------------------------------------------------*/

import { xxHash32 as xxHash32Base } from "js-xxhash";

export const xxHash32 = (s: string) => xxHash32Base(s, 0);
export const xxHash64 = (s: string) => _xxHash32(s, 2);
export const xxHash128 = (s: string) => _xxHash32(s, 4);

/**
 * xxHash32 only computes 32-bit values. Run it n times with different seeds to
 * get a larger hash with better collision resistance.
 *
 * @param str - The string to hash
 * @param words - The number of 32-bit words to hash
 * @returns A 128-bit hash
 */
function _xxHash32(str: string, words: number): bigint {
  let hash = 0n;
  for (let i = 0; i < words; i++) {
    hash = (hash << 32n) + BigInt(xxHash32Base(str, i));
  }
  return hash;
}
