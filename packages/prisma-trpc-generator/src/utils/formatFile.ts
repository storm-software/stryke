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
