/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/**
 * Check if the directory is the current system's root directory.
 *
 * @param dir - The directory to check.
 * @returns Returns true if the directory is the root directory.
 */
export const isSystemRoot = (dir: string): boolean => {
  return Boolean(dir === "/" || dir === "c:\\" || dir === "C:\\");
};
