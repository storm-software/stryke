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

import { ACRONYMS } from "./acronyms";
import { ARTICLES } from "./articles";
import { CONJUNCTIONS } from "./conjunctions";
import { PREPOSITIONS } from "./prepositions";
import { SPECIAL_CASES } from "./special-cases";

export interface FormatSpecialCasesOptions {
  /**
   * If true, use the descriptions from the acronym list instead of the display names.
   *
   * @defaultValue true
   */
  useDescriptions?: boolean;
}

/**
 * Handle special words in a title.
 *
 * @see https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case
 *
 * @param value - The word to handle
 * @param index - The index of the word in the title
 * @param words - The full title as an array of words
 * @returns The formatted word
 */
export function formatSpecialCases(
  value: string,
  index: number,
  words: string[],
  options?: FormatSpecialCasesOptions
): string {
  const lowercaseStr = value.toLowerCase();
  const uppercaseStr = value.toUpperCase();

  for (const special of SPECIAL_CASES) {
    if (special.toLowerCase() === lowercaseStr) {
      return special;
    }
  }

  if (ACRONYMS[uppercaseStr]) {
    return options?.useDescriptions !== false
      ? ACRONYMS[uppercaseStr].description
      : ACRONYMS[uppercaseStr].display || uppercaseStr;
  }

  // If the word is the first word in the sentence, but it's not a specially
  // cased word or an acronym, return the capitalized string
  if (index === 0) {
    return value;
  }

  // If the word is the last word in the sentence, but it's not a specially
  // cased word or an acronym, return the capitalized string
  if (index === words.length - 1) {
    return value;
  }

  // Return the word capitalized if it's 4 characters or more
  if (value.length >= 4) {
    return value;
  }

  if (PREPOSITIONS.includes(lowercaseStr)) {
    return lowercaseStr;
  }
  if (CONJUNCTIONS.includes(lowercaseStr)) {
    return lowercaseStr;
  }
  if (ARTICLES.includes(lowercaseStr)) {
    return lowercaseStr;
  }

  return value;
}
