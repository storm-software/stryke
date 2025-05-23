/* -------------------------------------------------------------------

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

 ------------------------------------------------------------------- */

import { isPlainObject } from "@stryke/type-checks/is-plain-object";
import type { DeepKey, DeepValue } from "@stryke/types/object";

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
export function flattenObject<
  TObject extends Record<string, any> = Record<string, any>,
  TDeepKeyObject extends {
    [TKey in DeepKey<TObject>]: DeepValue<TObject, TKey>;
  } = { [TKey in DeepKey<TObject>]: DeepValue<TObject, TKey> }
>(object: TObject): TDeepKeyObject {
  return flattenObjectImpl<TObject, TDeepKeyObject>(object);
}

function flattenObjectImpl<
  TObject extends Record<string, any> = Record<string, any>,
  TDeepKeyObject extends {
    [TKey in DeepKey<TObject>]: DeepValue<TObject, TKey>;
  } = { [TKey in DeepKey<TObject>]: DeepValue<TObject, TKey> }
>(object: TObject, prefix = ""): TDeepKeyObject {
  const result = {} as TDeepKeyObject;
  const keys = Object.keys(object);

  for (const key of keys) {
    const value = (object as any)[key];

    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value) && Object.keys(value).length > 0) {
      Object.assign(
        result,
        flattenObjectImpl<typeof value>(value, prefixedKey)
      );
    } else if (Array.isArray(value)) {
      for (const [index, element_] of value.entries()) {
        (result as any)[`${prefixedKey}.${index}` as DeepKey<TObject>] =
          element_;
      }
    } else {
      (result as any)[prefixedKey as DeepKey<TObject>] = value;
    }
  }

  return result;
}
