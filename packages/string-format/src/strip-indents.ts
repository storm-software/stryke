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
  // eslint-disable-next-line ts/no-unsafe-argument
  return String.raw(strings, ...values)
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .trim();
}
