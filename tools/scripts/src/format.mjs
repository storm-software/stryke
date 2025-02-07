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
  let files = "";
  if (argv._ && argv._.length > 0) {
    files = `--files ${argv._.join(" ")}`;
  }

  await $`pnpm nx run-many --target=lint,format --all --exclude="@stryke/monorepo" --parallel=5`.timeout(
    `${30 * 60}s`
  );
  await $`pnpm nx format:write ${files} --sort-root-tsconfig-paths --all`.timeout(
    `${30 * 60}s`
  );

  echo`${chalk.green("Successfully formatted the monorepo's files")}`;
} catch (error) {
  echo`${chalk.red(`A failure occured while formatting the monorepo:
${error?.message ? error.message : "No message could be found"}
`)}`;
}
