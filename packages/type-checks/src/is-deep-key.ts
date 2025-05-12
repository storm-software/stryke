/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { DeepKey } from "@stryke/types/object";

/**
 * Checks if a given key is a deep key.
 *
 * A deep key is a string that contains a dot (.) or square brackets with a property accessor.
 *
 * @example
 * isDeepKey('a.b') // true
 * isDeepKey('a[b]') // true
 * isDeepKey('a') // false
 * isDeepKey(123) // false
 * isDeepKey('a.b.c') // true
 * isDeepKey('a[b][c]') // true
 *
 * @param key - The key to check.
 * @returns Returns true if the key is a deep key, otherwise false.
 */
export function isDeepKey(key: PropertyKey): key is DeepKey<any> {
  switch (typeof key) {
    case "number":
    case "symbol": {
      return false;
    }
    case "string": {
      return key.includes(".") || key.includes("[") || key.includes("]");
    }
  }
}

/**
 * Checks if a given key is a deep key or normal (shallow key).
 *
 * A deep key is a string that contains a dot (.) or square brackets with a property accessor.
 *
 * @example
 * isDeepKey('a.b') // true
 * isDeepKey('a[b]') // true
 * isDeepKey('a') // true
 * isDeepKey(123) // false
 * isDeepKey('a.b.c') // true
 * isDeepKey('a[b][c]') // true
 *
 * @param key - The key to check.
 * @returns Returns true if the key is a deep key, otherwise false.
 */
export function isKeyOrDeepKey(key: PropertyKey): key is DeepKey<any> {
  switch (typeof key) {
    case "number": {
      return true;
    }
    case "symbol": {
      return false;
    }
    case "string": {
      return true;
    }
  }
}
