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

import { NPM_SCOPED_PACKAGE_REGEX, PACKAGE_PATH_REGEX } from "./regex";

/**
 * A function to validate if the input string is valid package path.
 *
 * @remarks
 * In this context, a valid package path is defined as either a standard package path or an npm scoped package path. A standard package path typically follows the format of a package name, while an npm scoped package path starts with an '\@' symbol followed by the scope name and the package name.
 *
 * @param input - The input string to validate as a package path.
 * @returns A boolean indicating whether the input string is a valid package path.
 */
export function isValidPackagePath(input: string): input is string {
  return PACKAGE_PATH_REGEX.test(input) || NPM_SCOPED_PACKAGE_REGEX.test(input);
}

/**
 * A function to validate if the input string is a valid file system path.
 *
 * @remarks
 * In this context, a valid file system path is defined as a string that starts with either a forward slash ('/'), a backslash ('\\'), a tilde ('~'), or a drive letter followed by a colon and a forward slash (e.g., 'C:/'). Additionally, it can also be a UNC path that starts with two backslashes ('\\\\').
 *
 * @param input - The input string to validate as a file system path.
 * @returns A boolean indicating whether the input string is a valid file system path.
 */
export function isValidFileSystemPath(input: string): input is string {
  return (
    input.length > 0 &&
    (input.startsWith("/") ||
      input.startsWith("\\") ||
      input.startsWith("~") ||
      /^[A-Z]:[/\\]/i.test(input) ||
      /^[A-Z]:$/i.test(input) ||
      /^[/\\]{2}/.test(input))
  );
}

/**
 * A function to validate if the input string is a valid path, which can be either a package path or a file system path.
 *
 * @remarks
 * This function combines the validation checks for both package paths and file system paths. It returns true if the input string is valid according to either of the two criteria.
 *
 * @param input - The input string to validate as a path.
 * @returns A boolean indicating whether the input string is a valid path.
 */
export function isValidPath(input: string): input is string {
  return isValidPackagePath(input) || isValidFileSystemPath(input);
}
