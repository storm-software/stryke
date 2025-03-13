#!/usr/bin/env zx
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

import { build } from "esbuild";
import { chalk, echo, usePwsh } from "zx";

usePwsh();

try {
  await echo`${chalk.whiteBright("⚙️  Bootstrapping the monorepo...")}`;

  await build({
    entryPoints: ["tools/nx/src/plugins/package-build.ts"],
    target: "node22",
    outdir: "dist/plugins",
    tsconfig: "tools/nx/tsconfig.json",
    packages: "bundle",
    external: ["nx", "@nx/devkit"],
    logLevel: "info",
    bundle: true,
    minify: false,
    format: "esm",
    platform: "node",
    preserveSymlinks: true
  });

  // const proc = $`pnpm nx reset`.timeout(`${5 * 60}s`);
  // proc.stdout.on("data", data => {
  //   echo`${data}`;
  // });
  // const result = await proc;
  // if (!result.ok) {
  //   throw new Error(
  //     `An error occured while resetting the Nx deamon process: \n\n${result.message}\n`
  //   );
  // }

  echo`${chalk.green("Completed monorepo bootstrapping successfully!")}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occured while bootstrapping the monorepo")}`;

  process.exit(1);
}
