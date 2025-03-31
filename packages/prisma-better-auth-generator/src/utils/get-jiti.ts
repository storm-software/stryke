/* -------------------------------------------------------------------

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

 ------------------------------------------------------------------- */

import { getEnvPaths } from "@stryke/env/get-env-paths";
import { getWorkspaceRoot } from "@stryke/path/get-workspace-root";
import { joinPaths } from "@stryke/path/join-paths";
import type { Jiti } from "jiti";
import { createJiti } from "jiti";

let jiti!: Jiti;

export function getJiti() {
  if (!jiti) {
    const envPaths = getEnvPaths();

    jiti = createJiti(getWorkspaceRoot(), {
      fsCache: joinPaths(envPaths.cache, "jiti"),
      interopDefault: true
    });
  }

  return jiti;
}
