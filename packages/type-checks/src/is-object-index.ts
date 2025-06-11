/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

const IS_UNSIGNED_INTEGER = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if the given value is an object index.
 *
 * @param value - The value to check.
 * @returns Returns `true` if the value is an object index, otherwise `false`.
 */
export function isObjectIndex(
  value: PropertyKey
): value is string | number | symbol {
  switch (typeof value) {
    case "number": {
      return (
        Number.isInteger(value) && value >= 0 && value < Number.MAX_SAFE_INTEGER
      );
    }
    case "symbol": {
      return false;
    }
    case "string": {
      return IS_UNSIGNED_INTEGER.test(value);
    }
  }
}
