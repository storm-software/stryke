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

import { getNonCryptoRandomValues } from "./random";

// This is taken from https://github.com/ai/nanoid/blob/main/index.browser.js We
// copy this because we want to use `--platform=neutral` which doesn't work with
// the npm package.
// Also we changed the random number generator to use Math.random() for compat
// with React Native.

/**
 * A wrapper around the [nanoid](https://github.com/ai/nanoid) package with some modifications.
 *
 * @param size - The size of the string to generate
 * @returns A unique identifier following the nanoid format
 */
export function nanoid(size = 21): string {
  // Use our custom getRandomValues function to fill a Uint8Array with random values.
  const randomBytes = getNonCryptoRandomValues(new Uint8Array(size));

  return randomBytes.reduce((id, byte) => {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unnecessary because
    // the bitmask trims bytes down to the alphabet size.
    byte &= 63;
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36);
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte > 62) {
      id += "-";
    } else {
      id += "_";
    }
    return id;
  }, "");
}
