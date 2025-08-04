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

import { stripComments } from "./strip-comments";

// https://github.com/fastify/secure-json-parse
// https://github.com/hapijs/bourne
const suspectProtoRx =
  /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx =
  /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;

const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(?:\.\d{1,17})?(?:E[+-]?\d+)?\s*$/i;

function jsonParseTransform(key: string, value: any): any {
  if (
    key === "__proto__" ||
    (key === "constructor" &&
      value &&
      typeof value === "object" &&
      "prototype" in value)
  ) {
    // eslint-disable-next-line no-console
    console.warn(`Dropping "${key}" key to prevent prototype pollution.`);
    return;
  }
  return value;
}

export interface Options {
  strict?: boolean;
}

export function parse<T = unknown>(value: any, options: Options = {}): T {
  if (typeof value !== "string") {
    return value;
  }

  let stripped = stripComments(value);

  if (
    stripped[0] === '"' &&
    stripped[stripped.length - 1] === '"' &&
    !stripped.includes("\\")
  ) {
    return stripped.slice(1, -1) as T;
  }

  stripped = stripped.trim();

  if (stripped.length <= 9) {
    switch (stripped.toLowerCase()) {
      case "true": {
        return true as T;
      }
      case "false": {
        return false as T;
      }
      case "undefined": {
        return undefined as T;
      }
      case "null": {
        return null as T;
      }
      case "nan": {
        return Number.NaN as T;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY as T;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY as T;
      }
    }
  }

  if (!JsonSigRx.test(stripped)) {
    if (options.strict) {
      throw new Error("Invalid JSON");
    }
    return stripped as T;
  }

  try {
    if (suspectProtoRx.test(stripped) || suspectConstructorRx.test(stripped)) {
      if (options.strict) {
        throw new Error("Possible prototype pollution");
      }
      return JSON.parse(stripped, jsonParseTransform);
    }

    return JSON.parse(stripped);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value as T;
  }
}

export function safeParse<T = unknown>(value: any, options: Options = {}): T {
  return parse<T>(value, { ...options, strict: true });
}
