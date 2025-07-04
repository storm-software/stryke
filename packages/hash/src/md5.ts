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

import { createHash } from "node:crypto";

/**
 * Generate an MD5 hash of the provided content.
 *
 * @param content - The content to hash.
 * @param length - The length of the hash to return.
 * @returns The generated MD5 hash.
 */
export function md5(content: string, length = 32) {
  return createHash("md5").update(content).digest("hex").slice(0, length);
}
