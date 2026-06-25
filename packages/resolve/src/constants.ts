/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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

export const JS_EXTENSIONS = ["js", "cjs", "mjs"] as const as string[];

export const TS_EXTENSIONS = ["ts", "cts", "mts"] as const as string[];

export const BUNDLE_EXTENSIONS = [
  ...JS_EXTENSIONS,
  ...TS_EXTENSIONS,
  "jsx",
  "tsx"
] as const as string[];

export const VALID_OBJECT_SOURCE_EXTENSIONS = [
  ...BUNDLE_EXTENSIONS,
  "json",
  "jsonc",
  "json5",
  "yaml",
  "yml",
  "toml"
] as const as string[];

export type ValidObjectSourceExtension =
  (typeof VALID_OBJECT_SOURCE_EXTENSIONS)[number];
