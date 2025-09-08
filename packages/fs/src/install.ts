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

import type { InstallPackageOptions } from "@antfu/install-pkg";
import { installPackage } from "@antfu/install-pkg";
import { cwd } from "@stryke/path/cwd";
import "tinyexec";
import { resolve } from "./resolve";

/**
 * Install a specific package
 *
 * @param name - The name of the package to install
 * @param options - The options to use when installing the package
 */
export async function install(
  name: string,
  options?: InstallPackageOptions
): Promise<ReturnType<typeof installPackage>>;

/**
 * Install a list of packages
 *
 * @param names - The list of package names to install
 * @param options - The options to use when installing the package
 */
export async function install(
  names: string[],
  options?: InstallPackageOptions
): Promise<ReturnType<typeof installPackage>>;

/**
 * Install a specific or list of packages
 *
 * @param nameOrNames - The name or names of packages to install
 * @param options - The options to use when installing the package
 * @returns The result of the command or an exception
 */
export async function install(
  nameOrNames: string | string[],
  options?: InstallPackageOptions
): Promise<ReturnType<typeof installPackage>> {
  return installPackage(nameOrNames, options);
}

/**
 * Check if a package exists and install it if it does not
 *
 * @param name - The name of the package to check
 * @param options - The options to use when installing the package
 */
export const packageExists = async (
  name: string,
  options?: InstallPackageOptions
) => {
  const resolvePath = await resolve(options?.cwd || cwd());
  try {
    await resolve(name, { paths: [resolvePath] });
  } catch {
    await install(name, options);
  }
};
