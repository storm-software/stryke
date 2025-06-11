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

import type { RefObject } from "@stryke/types/base";

/**
 * Check if the provided value's type is a ref
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the object provided is of type ref
 */
export const isRef = <TRef = unknown>(
  value: unknown
): value is RefObject<TRef> => {
  try {
    return (value as RefObject<TRef>)?.current !== undefined;
  } catch {
    return false;
  }
};
