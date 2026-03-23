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

import { toStringKey } from "@stryke/convert";
import { isDeepKey, isNumber } from "@stryke/type-checks";
import { toPath } from "./to-path";

/**
 * See the definition of `@types/lodash`.
 */
type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? "length" extends keyof T
      ? number extends T["length"]
        ? number extends keyof T
          ? T[number]
          : undefined
        : undefined
      : undefined
    : undefined;

type FieldWithPossiblyUndefined<T, Key> =
  | GetField<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;

type IndexedFieldWithPossiblyUndefined<T, Key> =
  | GetIndexedField<Exclude<T, undefined>, Key>
  | Extract<T, undefined>;

export type GetField<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof Exclude<T, undefined>
    ?
        | FieldWithPossiblyUndefined<Exclude<T, undefined>[Left], Right>
        | Extract<T, undefined>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? FieldWithPossiblyUndefined<
            IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>,
            Right
          >
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
        : undefined
      : IndexedFieldWithPossiblyUndefined<T, P>;

/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K - The type of the key in the object.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value.
 */
export function getField<T extends object, K extends keyof T>(
  object: T,
  path: K | readonly [K]
): T[K];
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K - The type of the key in the object.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value or undefined.
 */
export function getField<T extends object, K extends keyof T>(
  object: T | null | undefined,
  path: K | readonly [K]
): T[K] | undefined;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K - The type of the key in the object.
 * @typeParam D - The type of the default value.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The resolved value or default value.
 */
export function getField<T extends object, K extends keyof T, D>(
  object: T | null | undefined,
  path: K | readonly [K],
  defaultValue: D
): Exclude<T[K], undefined> | D;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1]
>(object: T, path: readonly [K1, K2]): T[K1][K2];
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value or undefined.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1]
>(object: T | null | undefined, path: readonly [K1, K2]): T[K1][K2] | undefined;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 * @typeParam D - The type of the default value.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The resolved value or default value.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  D
>(
  object: T | null | undefined,
  path: readonly [K1, K2],
  defaultValue: D
): Exclude<T[K1][K2], undefined> | D;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 * @typeParam K3 - The type of the third key in the object.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2]
>(object: T, path: readonly [K1, K2, K3]): T[K1][K2][K3];
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 * @typeParam K3 - The type of the third key in the object.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value or undefined.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2]
>(
  object: T | null | undefined,
  path: readonly [K1, K2, K3]
): T[K1][K2][K3] | undefined;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 * @typeParam K3 - The type of the third key in the object.
 * @typeParam D - The type of the default value.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The resolved value or default value.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  D
>(
  object: T | null | undefined,
  path: readonly [K1, K2, K3],
  defaultValue: D
): Exclude<T[K1][K2][K3], undefined> | D;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 * @typeParam K3 - The type of the third key in the object.
 * @typeParam K4 - The type of the fourth key in the object.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3]
>(object: T, path: readonly [K1, K2, K3, K4]): T[K1][K2][K3][K4];
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 * @typeParam K3 - The type of the third key in the object.
 * @typeParam K4 - The type of the fourth key in the object.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value or undefined.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3]
>(
  object: T | null | undefined,
  path: readonly [K1, K2, K3, K4]
): T[K1][K2][K3][K4] | undefined;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam K1 - The type of the first key in the object.
 * @typeParam K2 - The type of the second key in the object.
 * @typeParam K3 - The type of the third key in the object.
 * @typeParam K4 - The type of the fourth key in the object.
 * @typeParam D - The type of the default value.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The resolved value or default value.
 */
export function getField<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  D
>(
  object: T | null | undefined,
  path: readonly [K1, K2, K3, K4],
  defaultValue: D
): Exclude<T[K1][K2][K3][K4], undefined> | D;
/**
 * Retrieves the value at a given path from an object with numeric keys. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the value.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value.
 */
export function getField<T>(object: Record<number, T>, path: number): T;
/**
 * Retrieves the value at a given path from an object with numeric keys. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the value.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value or undefined.
 */
export function getField<T>(
  object: Record<number, T> | null | undefined,
  path: number
): T | undefined;
/**
 * Retrieves the value at a given path from an object with numeric keys. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the value.
 * @typeParam D - The type of the default value.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The resolved value or default value.
 */
export function getField<T, D>(
  object: Record<number, T> | null | undefined,
  path: number,
  defaultValue: D
): T | D;
/**
 * Retrieves the value at a given path from a null or undefined object, returning the default value.
 *
 * @typeParam D - The type of the default value.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The default value.
 */
export function getField<D>(
  object: null | undefined,
  path: PropertyKey,
  defaultValue: D
): D;

/**
 * Retrieves the value at a given path from a null or undefined object, returning undefined.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 */
export function getField(
  object: null | undefined,
  path: PropertyKey
): undefined;

/**
 * Retrieves the value at a given path from a string-keyed object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam P - The type of the path.
 *
 * @param data - The object to query.
 * @param path - The path of the property to get.
 * @returns The resolved value, or any if path is a general string.
 */
export function getField<T, P extends string>(
  data: T,
  path: P
): string extends P ? any : GetField<T, P>;
/**
 * Retrieves the value at a given path from a string-keyed object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @typeParam T - The type of the object.
 * @typeParam P - The type of the path.
 * @typeParam D - The type of the default value.
 *
 * @param data - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The resolved value or default value.
 */
export function getField<T, P extends string, D = GetField<T, P>>(
  data: T,
  path: P,
  defaultValue: D
): Exclude<GetField<T, P>, null | undefined> | D;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The resolved value.
 */
export function getField(
  object: unknown,
  path: PropertyKey | readonly PropertyKey[],
  defaultValue?: unknown
): any;
/**
 * Retrieves the value at a given path from an object. If the resolved value is undefined, the defaultValue is returned instead.
 *
 * @param object - The object to query.
 * @param path - The path of the property to get.
 * @param defaultValue - The value returned if the resolved value is undefined.
 * @returns The resolved value.
 */
export function getField(
  object: any,
  path: PropertyKey | readonly PropertyKey[],
  defaultValue?: any
): any {
  if (object === null) {
    return defaultValue;
  }

  switch (typeof path) {
    case "string": {
      const result = object[path];

      if (result === undefined) {
        if (isDeepKey(path)) {
          return getField(object, toPath(path), defaultValue);
        }
        return defaultValue;
      }

      return result;
    }
    case "number":
    case "symbol": {
      if (isNumber(path)) {
        path = toStringKey(path);
      }

      const result = Array.isArray(path)
        ? undefined
        : object[path as PropertyKey];
      if (result === undefined) {
        return defaultValue;
      }

      return result;
    }
    case "bigint":
    case "boolean":
    case "undefined":
    case "object":
    case "function":
    default: {
      if (Array.isArray(path)) {
        return getWithPath(object, path, defaultValue);
      }

      path = Object.is(path?.valueOf(), -0) ? "-0" : String(path);

      const result = object[path];

      if (result === undefined) {
        return defaultValue;
      }

      return result;
    }
  }
}

function getWithPath(
  object: any,
  path: readonly PropertyKey[],
  defaultValue?: any
): any {
  if (path.length === 0) {
    return defaultValue;
  }

  let current = object;

  for (const element of path) {
    if (current === null) {
      return defaultValue;
    }

    current = current[element];
  }

  if (current === undefined) {
    return defaultValue;
  }

  return current;
}
