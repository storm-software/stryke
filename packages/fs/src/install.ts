/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { InstallPackageOptions } from "@antfu/install-pkg";
import { installPackage } from "@antfu/install-pkg";
import { resolve } from "@stryke/path/resolve";
import "tinyexec";

/**
 * Install a package
 *
 * @param name - The name of the package to install
 * @param options - The options to use when installing the package
 * @returns The result of the command or an exception
 */
export const install = async (
  names: string | string[],
  options?: InstallPackageOptions
) => {
  return installPackage(names, options);
};

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
  const resolvePath = await resolve(options?.cwd || process.cwd());
  try {
    await resolve(name, { paths: [resolvePath] });
  } catch {
    await install(name, options);
  }
};
