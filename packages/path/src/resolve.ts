/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { Platform } from "@stryke/types/system";
import { interopDefault, resolvePath, resolvePathSync } from "mlly";
import { correctPath } from "./correct-path";
import { findFilePath } from "./file-path-fns";
import { getWorkspaceRoot } from "./get-workspace-root";
import { joinPaths } from "./join-paths";

export interface PackageResolvingOptions {
  /**
   * Paths to resolve the package from
   */
  paths?: string[];

  /**
   * Resolve path as linux (stand-in for unix/posix) or win32
   */
  platform?: Platform;
}

/**
 * Resolve the path to a specified module
 *
 * @param path - The path to the module
 * @param options - The options to use when resolving the module
 * @returns A promise for the path to the module
 */
export async function resolve(
  path: string,
  options: PackageResolvingOptions = {}
) {
  const paths = options.paths ?? [];
  if (paths.length === 0) {
    paths.push(process.cwd());
  }

  const workspaceRoot = getWorkspaceRoot();
  if (!paths.includes(workspaceRoot)) {
    paths.push(workspaceRoot);
  }

  return correctPath(
    await resolvePath(path, {
      url: paths
    })
  );
}

/**
 * Resolve the path to a specified module
 *
 * @param path - The path to the module
 * @param options - The options to use when resolving the module
 * @returns The path to the module or undefined
 */
export function resolveSync(
  path: string,
  options: PackageResolvingOptions = {}
) {
  const paths = options.paths ?? [];
  if (paths.length === 0) {
    paths.push(process.cwd());
  }

  const workspaceRoot = getWorkspaceRoot();
  if (!paths.includes(workspaceRoot)) {
    paths.push(workspaceRoot);
  }

  return correctPath(
    resolvePathSync(path, {
      url: options.paths
    })
  );
}

/**
 * Resolve the path to a specified module with error handling
 *
 * @param name - The name of the module
 * @param options - The options to use when resolving the module
 * @returns A promise for the path to the module
 */
export async function resolveSafe(
  name: string,
  options: PackageResolvingOptions = {}
) {
  try {
    return await resolve(name, options);
  } catch {
    return undefined;
  }
}

/**
 * Resolve the path to a specified module with error handling
 *
 * @param name - The name of the module
 * @param options - The options to use when resolving the module
 * @returns The path to the module or undefined
 */
export function resolveSafeSync(
  name: string,
  options: PackageResolvingOptions = {}
) {
  try {
    return resolveSync(name, options);
  } catch {
    return undefined;
  }
}

/**
 * Import a module from a specified path
 *
 * @param path - The path to the module
 * @returns The module
 */
export async function importModule<T = any>(path: string): Promise<T> {
  const i = await import(path);

  if (i) {
    return interopDefault(i);
  }

  return i;
}

/**
 * Resolve the path to a specified package asynchronously
 *
 * @remarks
 * This path points to the root of the package, which is usually the directory containing the `package.json` file. Please note: this path does not include the `package.json` file itself.
 *
 * @param name - The name of the module
 * @returns A promise for the module or undefined
 */
export async function resolvePackage(
  name: string,
  options: PackageResolvingOptions = {}
) {
  let result = await resolveSafe(joinPaths(name, "package.json"), options);
  if (!result) {
    result = await resolveSafe(joinPaths(name, "index.js"), options);
    if (!result) {
      result = await resolveSafe(name, options);
    }
  }

  return result ? findFilePath(result) : undefined;
}

/**
 * Resolve the path to a specified package synchronously
 *
 * @remarks
 * This path points to the root of the package, which is usually the directory containing the `package.json` file. Please note: this path does not include the `package.json` file itself.
 *
 * @param name - The name of the module
 * @param options - The options to use when resolving the module
 * @returns The module or undefined
 */
export async function resolvePackageSync(
  name: string,
  options: PackageResolvingOptions = {}
) {
  let result = resolveSafeSync(joinPaths(name, "package.json"), options);
  if (!result) {
    result = resolveSafeSync(joinPaths(name, "index.js"), options);
    if (!result) {
      result = resolveSafeSync(name, options);
    }
  }

  return result ? findFilePath(result) : undefined;
}
