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

import { ACRONYMS } from "./acronyms";
import { upperCaseFirst } from "./upper-case-first";

export const FORMAT_MAPPING = ACRONYMS.reduce(
  (ret, acronym) => {
    ret[acronym.toLowerCase()] = acronym;
    return ret;
  },
  {
    cspell: "CSpell",
    eslint: "ESLint",
    nx: "Nx"
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
   * The current list of word format mappings is stored in {@link FORMAT_MAPPING}.
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
}

/**
 * Convert the input string to title case.
 *
 *  @remarks
 * "This Is An Example"
 *
 * @param input - The input string.
 * @returns The title cased string.
 */
export function titleCase<T extends string | undefined>(
  input?: T,
  options: TitleCaseOptions = {}
): T {
  if (!input) {
    return input as T;
  }

  const formatSegment = (segment: string) =>
    segment
      .toLowerCase()
      .split(/[\s\-_]+/)
      .filter(Boolean)
      .map((word, index) => {
        if (
          !options.skipLowerCaseWhenNotFirst &&
          LOWER_CASE_WHEN_NOT_FIRST.includes(word.toLowerCase()) &&
          index > 0
        ) {
          return word.toLowerCase();
        }

        if (
          !options.skipFormatMapping &&
          Object.keys(FORMAT_MAPPING).includes(word.toLowerCase())
        ) {
          return FORMAT_MAPPING[word.toLowerCase()];
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
