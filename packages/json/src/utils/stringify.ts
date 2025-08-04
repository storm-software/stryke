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

import { isNumber } from "@stryke/type-checks/is-number";
import { isUndefined } from "@stryke/type-checks/is-undefined";

export const invalidKeyChars = [
  "@",
  "/",
  "#",
  "$",
  " ",
  ":",
  ";",
  ",",
  ".",
  "!",
  "?",
  "&",
  "=",
  "+",
  "-",
  "*",
  "%",
  "^",
  "~",
  "|",
  "\\",
  '"',
  "'",
  "`",
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "<",
  ">"
] as const;

/**
 * Stringify a value to a JSON-like string.
 *
 * @param value - The value to stringify
 * @param spacing - The spacing to use for the stringification
 * @returns The stringified value
 */
export const stringify = (
  value: unknown,
  spacing: string | number = 2
): string => {
  const space = isNumber(spacing) ? " ".repeat(spacing) : spacing;

  switch (value) {
    case null: {
      return "null";
    }
    case undefined: {
      return '"undefined"';
    }
    case true: {
      return "true";
    }
    case false: {
      return "false";
    }
    case Number.POSITIVE_INFINITY: {
      return "infinity";
    }
    case Number.NEGATIVE_INFINITY: {
      return "-infinity";
    }
  }

  if (Array.isArray(value)) {
    return `[${space}${value.map(v => stringify(v, space)).join(`,${space}`)}${space}]`;
  }
  if (value instanceof Uint8Array) {
    return value.toString();
  }

  // eslint-disable-next-line ts/switch-exhaustiveness-check
  switch (typeof value) {
    case "number": {
      return `${value}`;
    }
    case "string": {
      return JSON.stringify(value);
    }
    case "object": {
      const keys = Object.keys(value as object).filter(
        key => !isUndefined((value as any)[key])
      );

      return `{${space}${keys
        .map(
          key =>
            `${invalidKeyChars.some(invalidKeyChar => key.includes(invalidKeyChar)) ? `"${key}"` : key}: ${space}${stringify((value as any)[key], space)}`
        )
        .join(`,${space}`)}${space}}`;
    }
    default:
      return "null";
  }
};
