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

import { existsSync as existsSyncFs } from "node:fs";
import { access, constants } from "node:fs/promises";

/**
 * Check if a file exists
 *
 * @param filePath - The file path to check
 * @returns An indicator specifying if the file exists
 */
export const existsSync = (filePath: string): boolean => {
  return existsSyncFs(filePath);
};

/**
 * Check if a file exists
 *
 * @param filePath - The file path to check
 * @returns An indicator specifying if the file exists
 */
export const exists = async (filePath: string): Promise<boolean> => {
  return access(filePath, constants.F_OK)
    .then(() => true)
    .catch(() => false);
};
