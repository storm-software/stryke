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
 * Regular expression pattern to split strings into words for various case conversions
 *
 * This pattern matches sequences of characters in a string, considering the following case:
 * - Sequences of two or more uppercase letters followed by an uppercase letter and lowercase letters or digits (for acronyms)
 * - Sequences of one uppercase letter optionally followed by lowercase letters and digits
 * - Single uppercase letters
 * - Sequences of digits
 *
 * The resulting match can be used to convert camelCase, snake_case, kebab-case, and other mixed formats into
 * a consistent format like snake case.
 *
 * @example
 * const matches = 'camelCaseHTTPRequest'.match(CASE_SPLIT_PATTERN);
 * // matches: ['camel', 'Case', 'HTTP', 'Request']
 */
export const CASE_SPLIT_PATTERN = /[A-Z]?[a-z]+|\d+|[A-Z]+(?![a-z])/g;

/**
 * Splits a string into words using a regular expression pattern
 *
 * @example
 * const words = getWords('camelCaseHTTPRequest');
 * // words: ['camel', 'Case', 'HTTP', 'Request']
 *
 * @param str - The string to split into words
 * @returns An array of words
 */
export function getWords(str: string): string[] {
  if (str.length > 2000) {
    throw new Error(
      "The regular expression parameter of `get-words` can't handle strings longer than 2000 characters"
    );
  }

  return [...(str.match(CASE_SPLIT_PATTERN) ?? [])];
}
