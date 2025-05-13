#!/usr/bin/env zx
/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { $, chalk, echo } from "zx";

// usePwsh();

try {
  await echo`${chalk.whiteBright("💣  Nuking the monorepo...")}`;

  let proc =
    $`pnpm exec rimraf --no-interactive --glob "**/{node_modules,dist,.storm}"`.timeout(
      `${5 * 60}s`
    );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occured while removing node modules and build directories from the monorepo's projects: \n\n${result.message}\n`
    );
  }

  proc =
    $`pnpm exec rimraf --no-interactive --glob "node_modules/!rimraf/**"`.timeout(
      `${5 * 60}s`
    );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occured while removing node modules from the workspace root: \n\n${result.message}\n`
    );
  }

  proc = $`pnpm nx clear-cache`.timeout(`${5 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occured while clearing Nx cache: \n\n${result.message}\n`
    );
  }

  proc =
    $`pnpm exec rimraf --no-interactive -- ./.nx/cache ./.nx/workspace-data ./dist ./tmp ./pnpm-lock.yaml`.timeout(
      `${5 * 60}s`
    );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occured while removing cache directories: \n\n${result.message}\n`
    );
  }

  echo`${chalk.green("Successfully nuked the cache, node modules, and build folders")}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occured while nuking the monorepo")}`;

  process.exit(1);
}
