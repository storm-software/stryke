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

import { defineConfig } from "tsup";

export default defineConfig({
  name: "tools-nx",
  entry: ["index.ts", "src/plugins/*.ts"],
  target: "node22",
  format: ["cjs", "esm"],
  bundle: true,
  splitting: true,
  treeshake: true,
  keepNames: true,
  clean: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  dts: {
    resolve: true
  },
  onSuccess: async () => {
    // eslint-disable-next-line no-console
    console.log("tools-nx build completed successfully!");
  }
});
