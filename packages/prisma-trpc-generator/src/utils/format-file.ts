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

import prettier from "prettier";

export async function formatFile(content: string): Promise<string> {
  const options = await prettier.resolveConfig(process.cwd());

  let formatOptions = options;
  if (!options) {
    formatOptions = {
      trailingComma: "all",
      tabWidth: 2,
      printWidth: 80,
      bracketSpacing: true,
      semi: true,
      singleQuote: true,
      useTabs: false
    };
  }

  const formatted = await prettier.format(content, {
    ...formatOptions,
    parser: "typescript"
  });

  return formatted;
}
