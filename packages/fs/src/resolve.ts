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

import { getUnique } from "@stryke/helpers/get-unique";
import { appendPath, replacePath } from "@stryke/path";
import { correctPath } from "@stryke/path/correct-path";
import { cwd } from "@stryke/path/cwd";
import { findFileName, findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { interopDefault, resolvePath, resolvePathSync } from "mlly";
import { existsSync } from "node:fs";
import { getWorkspaceRoot } from "./get-workspace-root";

export const DEFAULT_EXTENSIONS = [
  "js",
  "jsx",
  "mjs",
  "cjs",
  "ts",
  "tsx",
  "mts",
  "cts",
  "json",
  "jsonc",
  "json5",
  "node"
];

export interface ResolveOptions {
  /**
   * Paths to resolve the package from
   */
  paths?: string[];

  /**
   * File extensions to consider when resolving the module
   *
   * @remarks
   * Extensions can be provided with or without the leading dot. The resolver utilities will handle both cases.
   *
   * @defaultValue ["js", "jsx", "mjs", "cjs", "ts", "tsx", "mts", "cts", "json", "jsonc", "json5", "node", "wasm"]
   */
  extensions?: string[];

  /**
   * Conditions to consider when resolving package exports.
   */
  conditions?: string[];
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
  options: ResolveOptions = {}
): Promise<string> {
  let paths = options.paths ?? [];
  if (paths.length === 0) {
    paths.push(cwd());
  }

  const workspaceRoot = getWorkspaceRoot();
  if (!paths.includes(workspaceRoot)) {
    paths.push(workspaceRoot);
  }

  paths = getUnique(
    paths
      .filter(Boolean)
      .map(p => correctPath(p))
      .reduce((ret, p, _, arr) => {
        ret.push(p);

        if (existsSync(appendPath(p, workspaceRoot))) {
          ret.push(appendPath(p, workspaceRoot));
        }

        arr.forEach(existing => {
          if (existsSync(appendPath(p, existing))) {
            ret.push(appendPath(p, existing));
          }
        });

        return ret;
      }, [] as string[])
  );

  let result: string | undefined;
  let error: Error | undefined;

  try {
    result = await resolvePath(path, {
      url: paths,
      extensions: options.extensions ?? DEFAULT_EXTENSIONS,
      conditions: options.conditions
    });
  } catch (err) {
    error = err as Error;
  }

  if (!result) {
    for (let i = 0; i < paths.length && !result; i++) {
      try {
        result = await resolvePath(replacePath(path, paths[i]), {
          url: paths,
          extensions: options.extensions ?? DEFAULT_EXTENSIONS,
          conditions: options.conditions
        });
      } catch (err) {
        error = err as Error;
      }
    }
  }

  if (!result && findFileName(path, { withExtension: false }) !== "index") {
    try {
      result = await resolve(joinPaths(path, "index"), {
        ...options,
        paths
      });
      if (result) {
        // Remove the previously added index file from the path
        result = findFilePath(result);
      }
    } catch (err) {
      error = err as Error;
    }
  }

  if (!result) {
    throw error ?? new Error(`Cannot resolve module '${path}'`);
  }

  return correctPath(result);
}

/**
 * Resolve the path to a specified module
 *
 * @param path - The path to the module
 * @param options - The options to use when resolving the module
 * @returns The path to the module or undefined
 */
export function resolveSync(path: string, options: ResolveOptions = {}) {
  let paths = options.paths ?? [];
  if (paths.length === 0) {
    paths.push(process.cwd());
  }

  const workspaceRoot = getWorkspaceRoot();
  if (!paths.includes(workspaceRoot)) {
    paths.push(workspaceRoot);
  }

  paths = getUnique(
    paths
      .filter(Boolean)
      .map(p => correctPath(p))
      .reduce((ret, p, _, arr) => {
        ret.push(p);

        if (existsSync(appendPath(p, workspaceRoot))) {
          ret.push(appendPath(p, workspaceRoot));
        }

        arr.forEach(existing => {
          if (existsSync(appendPath(p, existing))) {
            ret.push(appendPath(p, existing));
          }
        });

        return ret;
      }, [] as string[])
  );

  let result!: string;
  let error: Error | undefined;

  try {
    result = resolvePathSync(path, {
      url: paths,
      extensions: options.extensions ?? DEFAULT_EXTENSIONS,
      conditions: options.conditions
    });
  } catch (err) {
    error = err as Error;
  }

  if (!result) {
    for (let i = 0; i < paths.length && !result; i++) {
      try {
        result = resolvePathSync(replacePath(path, paths[i]), {
          url: paths,
          extensions: options.extensions ?? DEFAULT_EXTENSIONS,
          conditions: options.conditions
        });
      } catch (err) {
        error = err as Error;
      }
    }
  }

  if (!result && findFileName(path, { withExtension: false }) !== "index") {
    try {
      result = resolveSync(joinPaths(path, "index"), {
        ...options,
        paths
      });
      if (result) {
        // Remove the previously added index file from the path
        result = findFilePath(result);
      }
    } catch (err) {
      error = err as Error;
    }
  }

  if (!result) {
    throw error ?? new Error(`Cannot resolve module '${path}'`);
  }

  return correctPath(result);
}

/**
 * Resolve the path to a specified module with error handling
 *
 * @param name - The name of the module
 * @param options - The options to use when resolving the module
 * @returns A promise for the path to the module
 */
export async function resolveSafe(name: string, options: ResolveOptions = {}) {
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
export function resolveSafeSync(name: string, options: ResolveOptions = {}) {
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
  options: ResolveOptions = {}
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
export function resolvePackageSync(name: string, options: ResolveOptions = {}) {
  let result = resolveSafeSync(joinPaths(name, "package.json"), options);
  if (!result) {
    result = resolveSafeSync(joinPaths(name, "index.js"), options);
    if (!result) {
      result = resolveSafeSync(name, options);
    }
  }

  return result ? findFilePath(result) : undefined;
}
