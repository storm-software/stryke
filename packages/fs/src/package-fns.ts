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

import { StormJSON } from "@stryke/json/storm-json";
import { exists, findFileName, findFilePath, joinPaths } from "@stryke/path";
import { getParentPath } from "@stryke/path/get-parent-path";
import { getWorkspaceRoot } from "@stryke/path/get-workspace-root";
import type { PackageResolvingOptions } from "@stryke/path/resolve";
import { resolvePackage } from "@stryke/path/resolve";
import type { PackageJson } from "@stryke/types/package-json";
import type { PackageManager } from "@stryke/types/package-manager";
import { readFile } from "./read-file";

/**
 * Get the package manager used in the project
 * @param dir - The path to the project
 * @returns The package manager used in the project
 */
export function getPackageManager(dir = getWorkspaceRoot()): PackageManager {
  const lockFile = getParentPath(
    ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lock"],
    dir
  );

  if (!lockFile) {
    // default use pnpm
    return "pnpm";
  }

  switch (findFileName(lockFile)) {
    case "yarn.lock": {
      return "yarn";
    }
    case "pnpm-lock.yaml": {
      return "pnpm";
    }
    case "bun.lock": {
      return "bun";
    }
    default: {
      return "npm";
    }
  }
}

// Much of the below code comes from https://github.com/antfu-collective/local-pkg with some modifications

async function searchPackageJSON(dir: string) {
  let packageJsonPath;

  while (true) {
    if (!dir) {
      return;
    }
    const newDir = findFilePath(dir);

    if (newDir === dir) {
      return;
    }

    dir = newDir;
    packageJsonPath = joinPaths(dir, "package.json");

    if (await exists(packageJsonPath)) {
      break;
    }
  }

  return packageJsonPath;
}

async function getPackageJsonPath(
  name: string,
  options: PackageResolvingOptions = {}
) {
  const entry = await resolvePackage(name, options);
  if (!entry) {
    return;
  }

  return searchPackageJSON(entry);
}

/**
 * Get package info
 *
 * @param name - The name of the package
 * @param options - The options to use when resolving the package
 * @returns The package info
 */
export async function getPackageInfo(
  name: string,
  options: PackageResolvingOptions = {}
) {
  const packageJsonPath = await getPackageJsonPath(name, options);

  if (!packageJsonPath) {
    return;
  }

  const packageJson = StormJSON.parse<PackageJson>(
    await readFile(packageJsonPath)
  );

  return {
    name,
    version: packageJson.version,
    rootPath: findFilePath(packageJsonPath),
    packageJsonPath,
    packageJson
  };
}

/**
 * Get package info synchronously
 *
 * @param name - The name of the package
 * @param options - The options to use when resolving the package
 * @returns The package info
 */
export async function getPackageInfoSync(
  name: string,
  options: PackageResolvingOptions = {}
) {
  const packageJsonPath = await getPackageJsonPath(name, options);

  if (!packageJsonPath) return;

  const packageJson = StormJSON.parse<PackageJson>(
    await readFile(packageJsonPath)
  );

  return {
    name,
    version: packageJson.version,
    rootPath: findFilePath(packageJsonPath),
    packageJsonPath,
    packageJson
  };
}

/**
 * Get the package info from the package.json file
 *
 * @param cwd - The current working directory
 * @returns The package info
 */
export async function loadPackageJSON(
  cwd = getWorkspaceRoot()
): Promise<PackageJson | null> {
  const path = getParentPath("package.json", cwd, { skipCwd: false });

  if (!path || !(await exists(path))) {
    return null;
  }

  return StormJSON.parse<PackageJson>(await readFile(path));
}

/**
 * Check if a package is listed in the package.json file
 *
 * @param name - The name of the package
 * @param cwd - The current working directory
 * @returns An indicator specifying if the package is listed
 */
export async function isPackageListed(name: string, cwd?: string) {
  let packageName = name;
  if (packageName.includes("@")) {
    packageName =
      !packageName.startsWith("@") || packageName.lastIndexOf("@") > 0
        ? packageName.slice(0, packageName.lastIndexOf("@"))
        : packageName;
  }
  const pkg = (await loadPackageJSON(cwd)) ?? {};

  return (
    packageName in (pkg.dependencies ?? {}) ||
    packageName in (pkg.devDependencies ?? {})
  );
}

/**
 * Check if a package exists
 *
 * @param name - The name of the package
 * @param options - The options to use when resolving the package
 * @returns An indicator specifying if the package exists
 */
export function isPackageExists(
  name: string,
  options: PackageResolvingOptions = {}
) {
  return Boolean(resolvePackage(name, options));
}
