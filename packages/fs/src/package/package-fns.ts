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

import { StormJSON } from "@stryke/json/storm-json";
import {
  type PackageResolvingOptions,
  resolvePackage
} from "@stryke/path/resolve";
import {
  exists,
  findFileName,
  findFilePath,
  joinPaths
} from "@stryke/path/utilities";
import { getParentPath } from "@stryke/path/utilities/get-parent-path";
import { getWorkspaceRoot } from "@stryke/path/workspace/get-workspace-root";
import type { PackageJson } from "@stryke/types/utility-types/package-json";
import {
  PackageManagerLockFiles,
  PackageManagers
} from "@stryke/types/utility-types/package-manager";
import { readFile } from "node:fs/promises";

/**
 * Get the package manager used in the project
 * @param dir - The path to the project
 * @returns The package manager used in the project
 */
export function getPackageManager(dir = getWorkspaceRoot()): PackageManagers {
  const lockFile = getParentPath(
    [
      PackageManagerLockFiles.NPM,
      PackageManagerLockFiles.YARN,
      PackageManagerLockFiles.PNPM,
      PackageManagerLockFiles.BUN
    ],
    dir
  );

  if (!lockFile) {
    // default use pnpm
    return PackageManagers.PNPM;
  }

  switch (findFileName(lockFile)) {
    case PackageManagerLockFiles.YARN: {
      return PackageManagers.YARN;
    }
    case PackageManagerLockFiles.PNPM: {
      return PackageManagers.PNPM;
    }
    case PackageManagerLockFiles.BUN: {
      return PackageManagers.BUN;
    }
    default: {
      return PackageManagers.NPM;
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

    // eslint-disable-next-line no-await-in-loop
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
    await readFile(packageJsonPath, "utf8")
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
    await readFile(packageJsonPath, "utf8")
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
 * @param name - The name of the package
 * @param options - The options to use when resolving the package
 * @returns The package info
 */
export async function loadPackageJSON(
  cwd = getWorkspaceRoot()
): Promise<PackageJson | null> {
  let path = getParentPath("package.json", cwd, { skipCwd: false });

  if (!path || !(await exists(path))) {
    return null;
  }

  return StormJSON.parse<PackageJson>(await readFile(path, "utf8"));
}

/**
 * Check if a package is listed in the package.json file
 *
 * @param name - The name of the package
 * @param cwd - The current working directory
 * @returns An indicator specifying if the package is listed
 */
export async function isPackageListed(name: string, cwd?: string) {
  const pkg = (await loadPackageJSON(cwd)) ?? {};

  return (
    name in (pkg.dependencies ?? {}) || name in (pkg.devDependencies ?? {})
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
