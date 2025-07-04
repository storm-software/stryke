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

import { hash } from "@stryke/hash";
import { randomLetter } from "./random";

/**
 * ~22k hosts before 50% chance of initial counter collision with a remaining counter range of 9.0e+15 in JavaScript.
 */
const INITIAL_COUNT_MAX = 476_782_367;

/**
 * The length of the CUID fingerprint.
 */
const CUID_LARGE_LENGTH = 36;

/**
 * The sequence of the current running generator.
 *
 * @defaultValue 1
 */
const sequence = 1;

/**
 * The counter used to help prevent collisions.
 */
const counter = Math.floor(Math.random() * INITIAL_COUNT_MAX) + sequence;

/**
 * Generate a random letter
 *
 * @param length - The length of the random string to generate
 * @param random - The random number generator
 * @returns A random letter
 */
function createEntropy(length = 4, random = Math.random) {
  let entropy = "";

  while (entropy.length < length) {
    entropy += Math.floor(random() * CUID_LARGE_LENGTH).toString(
      CUID_LARGE_LENGTH
    );
  }
  return entropy;
}

export interface FingerprintOptions {
  globalObj?: any;
}

/**
 * This is a fingerprint of the host environment. It is used to help prevent collisions when generating ids in a distributed system.
 *
 * @remarks
 * If no global object is available, you can pass in your own, or fall back on a random string.
 *
 * @param options - Options
 * @returns The environment's Fingerprint
 */
function fingerprint(options?: FingerprintOptions): string {
  const globalObj =
    (options?.globalObj ?? typeof globalThis === "undefined")
      ? typeof globalThis === "undefined"
        ? {}
        : globalThis
      : globalThis;

  const globals = Object.keys(globalObj).toString();
  const sourceString =
    globals.length > 0
      ? globals + createEntropy(CUID_LARGE_LENGTH, Math.random)
      : createEntropy(CUID_LARGE_LENGTH, Math.random);

  return hash(sourceString).slice(0, Math.max(0, CUID_LARGE_LENGTH));
}

/**
 * Generate a random CUID
 *
 * @example
 * ```typescript
 *
 * // Generate a random CUID
 * const id = cuid();
 * ```
 *
 * @returns A random CUID string
 */
export function cuid(): string {
  // If we're lucky, the `.toString(36)` calls may reduce hashing rounds
  // by shortening the input to the hash function a little.
  const time = Date.now().toString(CUID_LARGE_LENGTH);
  const count = counter.toString(CUID_LARGE_LENGTH);

  // The salt should be long enough to be globally unique across the full
  // length of the hash. For simplicity, we use the same length as the
  // intended id output.
  const salt = createEntropy(CUID_LARGE_LENGTH, Math.random);

  const hashed = hash(`${time + salt + count + fingerprint()}`);

  return `${
    randomLetter() +
    hashed.slice(1, Math.min(hashed.length - 1, CUID_LARGE_LENGTH))
  }`;
}
