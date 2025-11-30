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

import { isSetObject } from "./is-set-object";
import { isSetString } from "./is-set-string";

/**
 * Determine if the provided value is of type URL
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `URL`
 */
export const isURL = (value: unknown): value is URL => {
  return (
    isSetObject(value) &&
    isSetString((value as URL).hash) &&
    isSetString((value as URL).host) &&
    isSetString((value as URL).hostname) &&
    isSetString((value as URL).href) &&
    isSetString((value as URL).origin) &&
    isSetString((value as URL).protocol)
  );
};
