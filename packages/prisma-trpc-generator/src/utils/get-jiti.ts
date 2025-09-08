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

import { getEnvPaths } from "@stryke/env/get-env-paths";
import { getWorkspaceRoot } from "@stryke/fs/get-workspace-root";
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
