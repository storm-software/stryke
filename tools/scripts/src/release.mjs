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
  let base = argv.base;
  if (!base) {
    base = process.env.NX_BASE;
  }
  let head = argv.head;
  if (!head) {
    head = process.env.NX_HEAD;
  }
  if (!base && !head) {
    throw new Error(
      `Base and head arguments are required. Please provide them using the --base and --head flags.`
    );
  }

  await echo`${chalk.whiteBright(`📦  Releasing Storm Stack packages (Base tag: "${base}", Head tag: "${head}")`)}`;

  let proc = $`pnpm build`.timeout(`${30 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occurred while building Storm Stack packages: \n\n${result.message}\n`
    );
  }

  proc = $`pnpm exec storm-git release --base=${base} --head=${head}`.timeout(
    `${30 * 60}s`
  );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occurred while releasing Storm Stack packages: \n\n${result.message}\n`
    );
  }

  echo`${chalk.green("Successfully released Storm Stack packages")}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occurred while releasing Storm Stack packages")}`;

  process.exit(1);
}
