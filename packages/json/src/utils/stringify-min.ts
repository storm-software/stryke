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

import { isNumber } from "@stryke/types/type-checks/is-number";

/**
 * Stringify a value to a JSON-like string.
 *
 * @param value - The value to stringify
 * @param spacing - The spacing to use for the stringification
 * @returns The stringified value
 */
export const stringifyMin = (
  value: unknown,
  spacing: string | number = " "
): string => {
  const space = isNumber(spacing) ? " ".repeat(spacing) : spacing;

  switch (value) {
    case null: {
      return "!n";
    }
    case undefined: {
      return "!u";
    }
    case true: {
      return "!t";
    }
    case false: {
      return "!f";
    }
  }

  if (Array.isArray(value)) {
    return `[${space}${value.map(v => stringifyMin(v, space)).join(`,${space}`)}${space}]`;
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
      // storm-ignore-next-line
      return JSON.stringify(value);
    }
    case "object": {
      const keys = Object.keys(value as object);

      return `{${space}${keys
        .map(
          k => `${k}${space}=${space}${stringifyMin((value as any)[k], space)}`
        )
        .join(`,${space}`)}${space}}`;
    }
    default:
      return "?";
  }
};
