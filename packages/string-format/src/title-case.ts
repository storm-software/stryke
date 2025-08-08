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

import { ACRONYM_LIST, ACRONYMS } from "./acronyms";
import { getWords } from "./get-words";
import { upperCaseFirst } from "./upper-case-first";

export const DISPLAY_MAPPING = ACRONYM_LIST.reduce(
  (ret, acronym) => {
    ret[acronym] = ACRONYMS[acronym]?.display || acronym;
    return ret;
  },
  {
    cspell: "CSpell",
    eslint: "ESLint"
  } as Record<string, string>
);

export const DESCRIPTION_MAPPING = ACRONYM_LIST.reduce(
  (ret, acronym) => {
    ret[acronym] =
      ACRONYMS[acronym]?.description || ACRONYMS[acronym]?.display || acronym;
    return ret;
  },
  {
    cspell: "CSpell",
    eslint: "ESLint"
  } as Record<string, string>
);

export const LOWER_CASE_WHEN_NOT_FIRST: string[] = [
  "a",
  "an",
  "the",
  "is",
  "are",
  "of",
  "and",
  "to",
  "in",
  "for",
  "on",
  "with",
  "as",
  "at",
  "by"
] as const;

export interface TitleCaseOptions {
  /**
   * If true, skip the format mapping. This will skip the conversion of known acronyms to their upper case form.
   *
   * @remarks
   * The current list of word format mappings is stored in {@link DISPLAY_MAPPING}.
   *
   * @defaultValue false
   */
  skipFormatMapping?: boolean;

  /**
   * If true, lower case words that are not the first word in the title.
   *
   * @remarks
   * The current list of words that are lower cased when not first are stored in {@link LOWER_CASE_WHEN_NOT_FIRST}.
   *
   *
   * @defaultValue false
   */
  skipLowerCaseWhenNotFirst?: boolean;

  /**
   * A custom mapping of words to their formatted versions.
   *
   * @remarks
   * This allows you to provide your own mappings for specific words that should be formatted in a certain way.
   */
  mapping?: Record<string, string>;

  /**
   * If true, use the descriptions from the acronym list instead of the display names.
   *
   * @defaultValue true
   */
  useDescriptions?: boolean;
}

/**
 * Check if the input string is in title case.
 *
 * @remarks
 * Title case is defined as a string where each word is separated by spaces, and starts with an uppercase letter followed by lowercase letters - "This Is An Example".
 *
 * @param input - The input string to check.
 * @returns True if the input is in title case, false otherwise.
 */
export function isTitleCase(input: string | undefined): boolean {
  if (!input) {
    return false;
  }

  // Split by spaces, hyphens, or underscores, and check each word
  const words = input.split(/[\s\-_]+/).filter(Boolean);

  return words.every((word, idx) => {
    // Allow for mapped acronyms (all uppercase or mixed case)
    if (DISPLAY_MAPPING[word.toUpperCase()]) {
      return true;
    }

    // Lowercase words allowed if not first and in LOWER_CASE_WHEN_NOT_FIRST
    if (
      idx > 0 &&
      LOWER_CASE_WHEN_NOT_FIRST.includes(word.toLowerCase()) &&
      word === word.toLowerCase()
    ) {
      return true;
    }

    // Otherwise, must start with uppercase, followed by lowercase or numbers
    return /^[A-Z][a-z0-9]*$/.test(word);
  });
}

/**
 * Convert the input string to title case.
 *
 *  @remarks
 * Title case is defined as a string where each word is separated by spaces, and starts with an uppercase letter followed by lowercase letters - "This Is An Example".
 *
 * @param input - The input string.
 * @returns The title cased string.
 */
export function titleCase<T extends string | undefined>(
  input: T,
  options: TitleCaseOptions = {}
): T {
  if (isTitleCase(input) || input === undefined) {
    return input;
  }

  const formatSegment = (segment: string) =>
    getWords(segment)
      .filter(Boolean)
      .map(word => word.toLowerCase())
      .map((word, index) => {
        if (
          !options.skipLowerCaseWhenNotFirst &&
          LOWER_CASE_WHEN_NOT_FIRST.includes(word.toLowerCase()) &&
          index > 0
        ) {
          return word.toLowerCase();
        }

        if (!options.skipFormatMapping && DISPLAY_MAPPING[word.toUpperCase()]) {
          if (options.useDescriptions !== false) {
            return DESCRIPTION_MAPPING[word.toUpperCase()];
          } else {
            return DISPLAY_MAPPING[word.toUpperCase()];
          }
        }

        if (
          options.mapping &&
          Object.keys(options.mapping).includes(word.toLowerCase())
        ) {
          return options.mapping[word.toLowerCase()];
        }

        return `${upperCaseFirst(word.toLowerCase())}`;
      })
      .join(" ");

  return input
    .split(/\s+-\s+/)
    .map(part => formatSegment(part))
    .join(" - ") as T;
}
