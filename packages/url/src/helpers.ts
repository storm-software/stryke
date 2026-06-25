/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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

import { URL_STRING_REGEX, VALID_URL_REGEX } from "./regex";
import type { URLString } from "./types";

export function formatLocalePath(locale: string) {
  let result = locale;
  if (result.includes("_")) {
    result = result.replace(/_/g, "-");
  }

  if (result.includes("-")) {
    const parts = result.split("-");
    if (parts.length > 1) {
      const lang = parts[0];
      const region = parts[1];
      if (lang && region) {
        result = `${lang}-${region}`;
      }
    }
  }

  return result.toLowerCase();
}

/**
 * Check if a string has a valid URL format.
 *
 * @param input - The string to check.
 * @returns `true` if the string is a valid URL, otherwise `false`.
 */
export function isValidURL(input: string): boolean {
  return VALID_URL_REGEX.test(input);
}

/**
 * Check if a string is a valid URL string reference.
 *
 * @param input - The string to check.
 * @returns `true` if the string is a valid URL string reference, otherwise `false`.
 */
export function isURLString(input: string): input is URLString {
  return URL_STRING_REGEX.test(input);
}
