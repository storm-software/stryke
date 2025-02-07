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

import { $, argv, chalk, echo, usePwsh } from "zx";

usePwsh();

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

  echo`${chalk.whiteBright(`
Building the monorepo in ${configuration} mode
`)}`;

  await $`pnpm bootstrap`.timeout(`60s`);

  if (configuration === "production") {
    await $`pnpm nx run-many --target=build --all --exclude="@stryke/monorepo" --configuration=production --parallel=5`;
  } else {
    await $`pnpm nx run-many --target=build --all --exclude="@stryke/monorepo" --configuration=${configuration} --nxBail`;
  }

  echo`${chalk.green(`Successfully built the monorepo in ${configuration} mode!`)}`;
} catch (error) {
  echo`${chalk.red(`A failure occured while building the monorepo:
${error?.message ? error.message : "No message could be found"}
`)}`;
}
