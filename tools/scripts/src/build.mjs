#!/usr/bin/env zx
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

import { $, argv, chalk, echo } from "zx";

try {
  let configuration = argv.configuration;
  if (!configuration) {
    if (argv.prod) {
      configuration = "production";
    } else if (argv.dev) {
      configuration = "development";
    } else {
      configuration = "production";
    }
  }

  await echo`${chalk.whiteBright(`📦  Building the monorepo in ${configuration} mode...`)}`;

  let proc = $`pnpm bootstrap`.timeout("60s");
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occured while bootstrapping the monorepo: \n\n${result.message}\n`
    );
  }

  if (configuration === "production") {
    proc = $`pnpm nx run-many --target=build --all --exclude="@stryke/monorepo,capnp" --configuration=production --parallel=5`;
    proc.stdout.on("data", data => {
      echo`${data}`;
    });
    result = await proc;

    if (!result.ok) {
      throw new Error(
        `An error occured while building the monorepo in production mode: \n\n${result.message}\n`
      );
    }

    proc = $`pnpm nx run capnp:build:production`;
    proc.stdout.on("data", data => {
      echo`${data}`;
    });
    result = await proc;

    if (!result.ok) {
      throw new Error(
        `An error occured while building the capnp package in production mode: \n\n${result.message}\n`
      );
    }
  } else {
    proc = $`pnpm nx run-many --target=build --all --exclude="@stryke/monorepo,capnp" --configuration=${configuration} --nxBail`;
    proc.stdout.on("data", data => {
      echo`${data}`;
    });
    result = await proc;

    if (!result.ok) {
      throw new Error(
        `An error occured while building the monorepo in ${configuration} mode: \n\n${result.message}\n`
      );
    }

    proc = $`pnpm nx run capnp:build:${configuration}`;
    proc.stdout.on("data", data => {
      echo`${data}`;
    });
    result = await proc;

    if (!result.ok) {
      throw new Error(
        `An error occured while building the capnp package in ${configuration} mode: \n\n${result.message}\n`
      );
    }
  }

  echo`${chalk.green(`Successfully built the monorepo in ${configuration} mode!`)}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occured while building the monorepo")}`;

  process.exit(1);
}
