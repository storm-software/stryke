/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/**
 * Removes indents, which is useful for printing warning and messages.
 *
 * @example
 * ```ts
 * stripIndents`
 *  Options:
 *  - option1
 *  - option2
 * `
 * ```
 *
 * @param strings - Template strings
 * @param values - Additional values
 * @returns The stripped string
 */
export function stripIndents(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  return String.raw(strings, ...values)
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .trim();
}
