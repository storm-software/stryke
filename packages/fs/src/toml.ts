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

import TOML from "smol-toml";
import { readFile, readFileSync } from "./read-file";
import { writeFile, writeFileSync } from "./write-file";

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param options - TOML parse options
 * @returns Object the TOML content of the file represents
 */
export function readTomlFileSync(
  path: string,
  options?: Parameters<typeof TOML.parse>[1]
) {
  const content = readFileSync(path);

  return TOML.parse(content, options);
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param options - TOML parse options
 * @returns Object the TOML content of the file represents
 */
export async function readTomlFile(
  path: string,
  options?: Parameters<typeof TOML.parse>[1]
) {
  const content = await readFile(path);

  return TOML.parse(content, options);
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param data - data which should be serialized/formatted to TOML and written to the file
 * @param options - TOML parse options
 */
export function writeTomlFileSync(
  path: string,
  data: object,
  options?: Parameters<typeof TOML.stringify>[1]
): void {
  return writeFileSync(path, TOML.stringify(data, options));
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param data - data which should be serialized/formatted to TOML and written to the file
 * @param options - TOML parse options
 */
export async function writeTomlFile(
  path: string,
  data: object,
  options?: Parameters<typeof TOML.stringify>[1]
): Promise<void> {
  return writeFile(path, TOML.stringify(data, options));
}
