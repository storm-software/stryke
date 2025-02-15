/*-------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/stryke
 Documentation:   https://stormsoftware.com/projects/stryke/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/stryke/license

 -------------------------------------------------------------------*/

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
