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

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @param value - The value to inspect.
 * @returns Returns the key.
 */
export function toStringKey(value: number): string | symbol {
  if (Object.is(value, -0)) {
    return "-0";
  }

  return value.toString();
}
