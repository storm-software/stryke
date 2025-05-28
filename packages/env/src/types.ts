/* -------------------------------------------------------------------

                             ⚡ Storm Software 

 This code was released as part of a Storm Software project. The project
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software
 Documentation:            https://stormsoftware.com/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

export const ENV_PREFIXES = [
  "VITE_",
  "ONE_",
  "STORM_PUBLIC_",
  "STORM_",
  "STORM_STACK_PUBLIC_",
  "STORM_STACK_",
  "NEXT_PUBLIC_"
];

export interface DotenvParseOutput {
  [name: string]: string | undefined;
}
