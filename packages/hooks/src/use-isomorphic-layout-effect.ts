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

import { isRuntimeServer } from "@stryke/env/runtime-checks";
import { useEffect, useLayoutEffect } from "react";

/**
 * The function checks if the code is running on the server-side
 *
 * @returns An indicator specifying if the code is running on the server-side
 */
export const useIsomorphicLayoutEffect = isRuntimeServer
  ? useEffect
  : useLayoutEffect;
