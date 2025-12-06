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

import type { UserConfig } from "tsdown";
import { defineConfig } from "tsdown";

export type TSDownOptions = Partial<UserConfig> & Pick<UserConfig, "name">;

export const DEFAULT_OPTIONS: Omit<Partial<UserConfig>, "name"> = {
  target: "node22",
  outDir: "dist",
  format: ["cjs", "esm"],
  cjsDefault: true,
  treeshake: true,
  exports: {
    all: true
  },
  clean: false,
  sourcemap: false,
  unbundle: true,
  platform: "node",
  tsconfig: "./tsconfig.json",
  minify: true,
  dts: true,
  shims: true,
  fixedExtension: true,
  nodeProtocol: true,
  skipNodeModulesBundle: true
};

export default DEFAULT_OPTIONS;

export function defineTSDownConfig(options: TSDownOptions | TSDownOptions[]) {
  return Array.isArray(options)
    ? defineConfig(
        options.map(option => ({
          ...DEFAULT_OPTIONS,
          onSuccess: async () => {
            console.log(` ✔ ${option.name} build completed successfully!`);
          },
          ...option
        }))
      )
    : defineConfig({
        ...DEFAULT_OPTIONS,
        onSuccess: async () => {
          console.log(` ✔ ${options.name} build completed successfully!`);
        },
        ...options
      });
}
