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

import type { DMMF, EnvValue } from "@prisma/generator-helper";
import type { Handler } from "@prisma/generator-helper/dist/generatorHandler";
import type { GetDMMFOptions } from "@prisma/internals";
import { getEnvPaths } from "@stryke/env";
import { getWorkspaceRoot, joinPaths } from "@stryke/path";
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

export async function getPrismaInternals() {
  return getJiti().import<{
    parseEnvValue: (p: EnvValue) => string;
    getDMMF: (options: GetDMMFOptions) => Promise<DMMF.Document>;
  }>(getJiti().esmResolve("@prisma/internals"));
}

export async function getPrismaGeneratorHelper() {
  return getJiti().import<{
    generatorHandler: (handler: Handler) => void;
  }>(getJiti().esmResolve("@prisma/generator-helper"));
}
