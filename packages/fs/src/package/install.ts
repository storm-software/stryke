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

import { installPackage, type InstallPackageOptions } from "@antfu/install-pkg";
import { resolve } from "@stryke/path/resolve/resolve";

/**
 * Install a package
 *
 * @param name - The name of the package to install
 * @param options - The options to use when installing the package
 * @returns The result of the command or an exception
 */
export const install = (
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
    resolve(name, { paths: [resolvePath] });
  } catch {
    install(name, options);
  }
};
