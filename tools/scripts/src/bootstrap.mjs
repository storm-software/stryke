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

import { build } from "esbuild";
import { chalk, echo, usePwsh } from "zx";

usePwsh();

try {
  await build({
    entryPoints: ["tools/nx/src/plugins/package-build.ts"],
    outdir: "dist/plugins",
    tsconfig: "tools/nx/tsconfig.json",
    packages: "external",
    logLevel: "info",
    bundle: true,
    minify: false,
    format: "esm",
    platform: "node"
  });

  echo`${chalk.green("Completed monorepo bootstrapping successfully!")}`;
} catch (error) {
  echo`${chalk.red(`A failure occured while building the monorepo:
${error?.message ? error.message : "No message could be found"}
`)}`;
}
