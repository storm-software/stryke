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

import { isSetString } from "@stryke/type-checks/is-set-string";

/**
 * Options for the `globToRegex` function.
 */
export interface GlobToRegexOptions {
  /**
   * Enables extended globbing features such as `?`, `+`, `@`, and `!`.
   *
   * @defaultValue true
   */
  extended?: boolean;

  /**
   * Enables globstar support (`**`).
   *
   * @defaultValue true
   */
  globstar?: boolean;

  /**
   * Flags to use for the generated regular expression.
   */
  flags?: string;
}

/**
 * Converts a glob pattern to a regular expression.
 *
 * @see https://mergify.com/blog/origin-and-evolution-of-the-globstar
 * @see https://en.wikipedia.org/wiki/Glob_(programming)
 *
 * @remarks
 * This function converts a glob pattern (like `*.{js,ts}` or `**\/src/**`) into a regular expression
 *
 * @example
 * ```ts
 * import { globToRegex } from "@stryke/path/glob-to-regex";
 *
 * const test1 = globToRegex("*.{js,ts}");
 * console.log(test1); // Output: /^([^/]*)\.(js|ts)$/
 *
 * const test2 = globToRegex("**\/src/**");
 * console.log(test2); // Output: /^((?:[^/]*(?:\/|$))*)?\/src\/((?:[^/]*(?:\/|$))*)?$/
 * ```
 *
 * @param glob - The glob pattern to convert.
 * @param options - The options for the conversion.
 * @returns The converted regular expression.
 */
export function globToRegex(
  glob: string,
  options: GlobToRegexOptions = {}
): RegExp {
  if (!isSetString(glob)) {
    throw new TypeError("A string was not provided as a glob pattern.");
  }

  let regex = "";
  let inGroup = false;
  for (let i = 0; i < glob.length; i++) {
    let starCount = 1;
    switch (glob[i]) {
      case "/":
      case "$":
      case "^":
      case "+":
      case ".":
      case "(":
      case ")":
      case "=":
      case "!":
      case "|":
        regex += `\\${glob[i]}`;
        break;

      case "?":
        if (options.extended !== false) {
          regex += ".";
        }
        break;

      case "[":
      case "]":
        if (options.extended !== false) {
          regex += glob[i];
        }
        break;

      case "{":
        if (options.extended !== false) {
          inGroup = true;
          regex += "(";
        }
        break;

      case "}":
        if (options.extended !== false) {
          inGroup = false;
          regex += ")";
        }
        break;

      case ",":
        if (inGroup) {
          regex += "|";
        }
        regex += `\\${glob[i]}`;
        break;

      case "*":
        starCount = 1;
        while (glob[i + 1] === "*") {
          starCount++;
          i++;
        }

        if (options.globstar === false) {
          regex += ".*";
        } else {
          const isGlobstar =
            starCount > 1 &&
            (glob[i - 1] === "/" || glob[i - 1] === undefined) &&
            (glob[i + 1] === "/" || glob[i + 1] === undefined);

          if (isGlobstar) {
            regex += "((?:[^\/]*(?:\/|$))*)";
            i++;
          } else {
            regex += "([^\/]*)";
          }
        }
        break;

      case undefined:
      default:
        regex += glob[i];
    }
  }

  const flags = isSetString(options.flags) ? options.flags : "";
  if (!flags || !~flags.indexOf("g")) {
    regex = `^${regex}$`;
  }

  return new RegExp(regex, flags);
}
