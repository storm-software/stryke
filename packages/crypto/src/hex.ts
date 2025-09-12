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

const ALPHABET = "0123456789ABCDEF";
const DECODE_MAP: Record<string, number> = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
};

/**
 * Encodes a Uint8Array into a hexadecimal string.
 *
 * @param input - The input Uint8Array.
 * @returns The hexadecimal string.
 */
export function encodeHex(input: Uint8Array): string {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    result += ALPHABET[input[i]! >> 4];
    result += ALPHABET[input[i]! & 0x0f];
  }
  return result;
}

/**
 * Encodes a Uint8Array into an uppercase hexadecimal string.
 *
 * @param input - The input Uint8Array.
 * @returns The uppercase hexadecimal string.
 */
export function decodeHex(input: string): Uint8Array {
  if (input.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const result = new Uint8Array(input.length / 2);
  for (let i = 0; i < input.length; i += 2) {
    if (!(input[i]! in DECODE_MAP)) {
      throw new Error("Invalid character");
    }
    if (!(input[i + 1]! in DECODE_MAP)) {
      throw new Error("Invalid character");
    }
    result[i / 2]! |= DECODE_MAP[input[i]!]! << 4;
    result[i / 2]! |= DECODE_MAP[input[i + 1]!]!;
  }
  return result;
}
