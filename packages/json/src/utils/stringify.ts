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
