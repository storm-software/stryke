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

import { isNumber } from "@stryke/type-checks/is-number";
import { isString } from "@stryke/type-checks/is-string";
import type { JsonPointerPath } from "@stryke/types/json";

const TILDA_ONE = /~1/g;
const TILDA_ZERO = /~0/g;
const TILDA = /~/g;
const FORWARD_SLASH = /\//g;

/**
 * Escapes a JSON pointer path segment.
 *
 * @param segment - JSON pointer path segment.
 * @returns Escaped JSON pointer path segment.
 */
export function escapePointerSegment(segment: string): string {
  if (!segment.includes("/") && !segment.includes("~")) {
    return segment;
  }

  return segment.replace(TILDA, "~0").replace(FORWARD_SLASH, "~1");
}

/**
 * Unescapes a JSON pointer path segment.
 *
 * @param segment - JSON pointer path segment.
 * @returns Unescaped JSON pointer path segment.
 */
export function unescapePointerSegment(segment: string): string {
  if (!segment.includes("~")) {
    return segment;
  }

  return segment.replace(TILDA_ONE, "/").replace(TILDA_ZERO, "~");
}

/**
 * Convert JSON pointer like "/foo/bar" to array like ["", "foo", "bar"], while
 * also un-escaping reserved characters.
 */
export function parseJsonPointer(pointer: string): JsonPointerPath {
  if (!pointer) return [];
  // TODO: Performance of this line can be improved: (1) don't use .split(); (2) don't use .map().
  return pointer
    .slice(1)
    .split("/")
    .map(segment => unescapePointerSegment(segment));
}

/**
 * Escape and format a path array like ["", "foo", "bar"] to JSON pointer
 * like "/foo/bar".
 */
export function formatJsonPointer(path: JsonPointerPath): string {
  // eslint-disable-next-line ts/no-use-before-define
  if (isRoot(path)) {
    return "";
  }

  return `/${path.map(segment => escapePointerSegment(String(segment))).join("/")}`;
}

/**
 * Returns true if JSON Pointer points to root value, false otherwise.
 */
export const isRoot = (path: string | number | JsonPointerPath): boolean =>
  isString(path)
    ? path === ""
    : isNumber(path)
      ? path === 0
      : Array.isArray(path) && path.length === 0;

/**
 * Returns parent path, e.g. for ['foo', 'bar', 'baz'] returns ['foo', 'bar'].
 */
export function parent(path: JsonPointerPath): JsonPointerPath {
  if (path.length === 0) {
    throw new Error("NO_PARENT");
  }

  return path.slice(0, -1);
}

/**
 * Check if path component can be a valid array index.
 */
export function isValidIndex(index: string | number): boolean {
  if (isNumber(index)) {
    return true;
  }

  const n = Number.parseInt(index, 10);

  return String(n) === index && n >= 0;
}

export const isInteger = (str: string): boolean => {
  const len = str.length;
  let i = 0;
  let charCode: any;
  while (i < len) {
    charCode = str.codePointAt(i);
    if (charCode >= 48 && charCode <= 57) {
      i++;
      continue;
    }
    return false;
  }
  return true;
};
