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

// const args = minimist(argv.slice(2), {
//   string: ["configuration"],
//   boolean: ["dev", "prod"],
//   default: {
//     configuration: "production"
//   }
// });

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

await $`pnpm bootstrap`.timeout(`60s`);

if (configuration === "production") {
  await $`nx run-many --target=build --all --exclude="@storm-stack/monorepo" --configuration=production --parallel=5`.timeout(
    `${15 * 60}s`
  );
} else {
  await $`nx run-many --target=build --all --exclude="@storm-stack/monorepo" --configuration=${configuration} --nxBail`.timeout(
    `${15 * 60}s`
  );
}

echo`${chalk.green(`Successfully built the monorepo in ${configuration} mode!`)}`;
