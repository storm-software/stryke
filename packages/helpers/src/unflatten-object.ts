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

import type { DeepKey, DeepValue } from "@stryke/types";
import { setField } from "./set-field";

/**
 * Flattens a nested object into a single level object with dot-separated keys.
 *
 * @example
 * ```typescript
 * const nestedObject = {
 *   a: {
 *     b: {
 *       c: 1
 *     }
 *   },
 *   d: [2, 3]
 * };
 *
 * const flattened = flattenObject(nestedObject);
 * console.log(flattened);
 * // Output:
 * // {
 * //   'a.b.c': 1,
 * //   'd.0': 2,
 * //   'd.1': 3
 * // }
 * ```
 *
 * @param object - The object to flatten.
 * @returns - The flattened object.
 */
export function unflattenObject<
  TObject extends Record<string, any> = Record<string, any>,
  TDeepKeyObject extends {
    [TKey in DeepKey<TObject>]: DeepValue<TObject, TKey>;
  } = { [TKey in DeepKey<TObject>]: DeepValue<TObject, TKey> },
>(deepKeyObject: TDeepKeyObject): TObject {
  return Object.entries(deepKeyObject).reduce(
    (ret: TObject, [key, value]: [string, any]) => {
      return setField<TObject>(ret, key as DeepKey<TObject>, value);
    },
    {} as TObject,
  );
}
