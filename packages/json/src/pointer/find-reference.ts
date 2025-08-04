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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";

export interface Reference {
  /** Target value where pointer is pointing. */
  readonly val: unknown;
  /** Object which contains the target value. */
  readonly obj?: unknown | object | unknown[];
  /** Key which targets the target value in the object. */
  readonly key?: string | number;
}

const { isArray } = Array;

/**
 * Finds a target in document specified by JSON Pointer. Also returns the
 * object containing the target and key used to reference that object.
 *
 * Throws Error('NOT_FOUND') if pointer does not result into a value in the middle
 * of the path. If the last element of the path does not result into a value, the
 * lookup succeeds with `val` set to `undefined`. It can be used to discriminate
 * missing values, because `undefined` is not a valid JSON value.
 *
 * If last element in array is targeted using "-", e.g. "/arr/-", use
 * `isArrayEnd` to verify that:
 *
 * ```js
 * const ref = find({arr: [1, 2, 3], ['arr', '-']});
 * if (isArrayReference(ref)) {
 *   if (isArrayEnd(ref)) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @param val - Document to search in.
 * @param path - JSON Pointer path.
 * @returns Reference to the target.
 */
export const find = (val: unknown, path: Reference["key"][]): Reference => {
  const pathLength = path.length;
  if (!pathLength) {
    return { val };
  }

  let obj: Reference["obj"];
  let key: Reference["key"];
  for (let i = 0; i < pathLength; i++) {
    obj = val;
    key = path[i];
    if (isArray(obj)) {
      const length = obj.length;
      if (key === "-") {
        key = length;
      } else if (isString(key)) {
        const key2 = Math.trunc(Number.parseInt(key));
        if (String(key2) !== key) {
          throw new Error("INVALID_INDEX");
        }

        key = key2;
        if (key < 0) {
          throw new Error("INVALID_INDEX");
        }
      }

      if (key) {
        val = obj[key];
      }
    } else if (isSetObject(obj)) {
      val = key && key in obj ? (obj as any)[key] : undefined;
    } else throw new Error("NOT_FOUND");
  }
  const ref: Reference = {
    val,
    obj,
    key
  };

  return ref;
};

export interface ArrayReference<T = unknown> {
  /** `undefined` in case JSON Pointer points to last element, e.g. "/foo/-". */
  readonly val: undefined | T;
  readonly obj: T[];
  readonly key: number;
}

export const isArrayReference = <T = unknown>(
  ref: Reference
): ref is ArrayReference<T> => isArray(ref.obj) && typeof ref.key === "number";

export const isArrayEnd = (ref: ArrayReference): boolean =>
  ref.obj.length === ref.key;

export interface ObjectReference<T = unknown> {
  readonly val: T;
  readonly obj: Record<string, T>;
  readonly key: string;
}

export const isObjectReference = <T = unknown>(
  ref: Reference
): ref is ObjectReference<T> =>
  typeof ref.obj === "object" && typeof ref.key === "string";
