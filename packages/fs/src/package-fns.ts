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

import { findFileName, findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { getPackageName } from "@stryke/string-format/package";
import { isString } from "@stryke/type-checks/is-string";
import type { PackageJson } from "@stryke/types/package-json";
import type { PackageManager } from "@stryke/types/package-manager";
import { existsSync } from "node:fs";
import type { Range } from "semver";
import { subset } from "semver";
import { exists } from "./exists";
import { getParentPath } from "./get-parent-path";
import { getWorkspaceRoot } from "./get-workspace-root";
import { readJsonFile } from "./json";
import type { PackageResolvingOptions } from "./resolve";
import { resolvePackage } from "./resolve";

/**
 * Get the package manager used in the project
 *
 * @param dir - The path to the project
 * @returns The package manager used in the project
 */
export function getPackageManager(dir = getWorkspaceRoot()): PackageManager {
  const lockFile = getParentPath(
    ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lock"],
    dir,
    {
      includeNameInResults: true
    }
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

async function searchPackageJson(dir: string) {
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

  return searchPackageJson(entry);
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

  const packageJson = await readJsonFile<PackageJson>(packageJsonPath);

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
export async function loadPackageJson(
  cwd = getWorkspaceRoot()
): Promise<PackageJson | null> {
  const path = getParentPath("package.json", cwd, {
    skipCwd: false,
    includeNameInResults: true
  });
  if (!path || !existsSync(path)) {
    return null;
  }

  return readJsonFile<PackageJson>(path);
}

export interface PackageExistsOptions {
  /**
   * The current working directory
   */
  cwd?: string;
}

export interface PackageMatchesOptions extends PackageExistsOptions {
  /**
   * The version range of the package to check
   */
  version?: string | Range;
}

/**
 * Check if a package is listed in the package.json file
 *
 * @param name - The name of the package
 * @param cwd - The current working directory
 * @returns An indicator specifying if the package is listed
 */
export async function isPackageListed(
  name: string,
  cwd?: string
): Promise<boolean>;

/**
 * Check if a package is listed in the package.json file
 *
 * @param name - The name of the package
 * @param options - The options to use when checking if the package is listed
 * @returns An indicator specifying if the package is listed
 */
export async function isPackageListed(
  name: string,
  options?: PackageExistsOptions
): Promise<boolean>;

/**
 * Check if a package is listed in the package.json file
 *
 * @param name - The name of the package
 * @param cwdOrOptions - The current working directory or options to use when checking if the package is listed
 * @returns An indicator specifying if the package is listed
 */
export async function isPackageListed(
  name: string,
  cwdOrOptions?: string | PackageExistsOptions
): Promise<boolean> {
  const packageName = getPackageName(name);
  const cwd = isString(cwdOrOptions) ? cwdOrOptions : cwdOrOptions?.cwd;

  const packageJson = await loadPackageJson(cwd);
  if (!packageJson) {
    return false;
  }

  return Boolean(
    (packageJson.dependencies &&
      packageName in packageJson.dependencies &&
      packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies &&
        packageName in packageJson.devDependencies &&
        packageJson.devDependencies[packageName])
  );
}

export interface GetPackageListingReturn {
  version: string;
  type: "dependencies" | "devDependencies";
}

/**
 * Return the package version and dependency type listed in the package.json file
 *
 * @param name - The name of the package
 * @param cwdOrOptions - The current working directory or options to use when checking if the package is listed
 * @returns The version and type of the package if listed, otherwise undefined
 */
export async function getPackageListing(
  name: string,
  cwdOrOptions?: string | PackageExistsOptions
): Promise<GetPackageListingReturn | undefined> {
  const packageName = getPackageName(name);
  const cwd = isString(cwdOrOptions) ? cwdOrOptions : cwdOrOptions?.cwd;

  const packageJson = await loadPackageJson(cwd);
  if (!packageJson) {
    return undefined;
  }

  const version =
    packageJson.dependencies && packageName in packageJson.dependencies
      ? packageJson.dependencies[packageName]
      : packageJson.devDependencies &&
          packageName in packageJson.devDependencies
        ? packageJson.devDependencies[packageName]
        : undefined;
  const type =
    (packageJson.dependencies && packageName in packageJson.dependencies
      ? "dependencies"
      : packageJson.devDependencies &&
          packageName in packageJson.devDependencies
        ? "devDependencies"
        : undefined) || undefined;

  return version && type
    ? {
        version,
        type
      }
    : undefined;
}

/**
 * Check if a package version matches a specific version range
 *
 * @param name - The name of the package
 * @param version - The version to check against
 * @param cwd - The current working directory
 * @returns An indicator specifying if the package version matches the range
 */
export async function doesPackageMatch(
  name: string,
  version: string,
  cwd?: string
): Promise<boolean> {
  const pkg = await getPackageListing(name, { cwd });
  if (!pkg) {
    return false;
  }

  return (
    pkg.version.startsWith("catalog:") ||
    pkg.version.startsWith("workspace:") ||
    subset(pkg.version, version)
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
