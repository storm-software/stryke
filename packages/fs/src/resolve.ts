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
import { appendExtension } from "@stryke/path";
import { correctPath, toAbsolutePath } from "@stryke/path/correct-path";
import { cwd } from "@stryke/path/cwd";
import {
  findFileExtension,
  findFileName,
  findFilePath,
  findFolderName
} from "@stryke/path/file-path-fns";
import { isAbsolutePath, isNpmScopedPackage } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { interopDefault, resolvePath, resolvePathSync } from "mlly";
import { existsSync } from "./exists";
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
 * Get the resolution paths based on the provided paths, current working directory, and workspace root.
 *
 * @param paths - An array of paths to include in the resolution.
 * @returns An array of unique, corrected resolution paths.
 */
export function getResolutionPaths(paths: string[] = []) {
  let resolutionPaths = paths;
  if (!resolutionPaths.includes(cwd())) {
    resolutionPaths.push(cwd());
  }

  const workspaceRoot = getWorkspaceRoot();
  if (!resolutionPaths.includes(workspaceRoot)) {
    resolutionPaths.push(workspaceRoot);
  }

  resolutionPaths = getUnique(
    resolutionPaths
      .filter(Boolean)
      .map(path => correctPath(path))
      .reduce((ret, path, _, arr) => {
        ret.push(path);
        if (!isAbsolutePath(path)) {
          ret.push(toAbsolutePath(path, cwd()));
          ret.push(toAbsolutePath(path, workspaceRoot));

          arr.forEach(existing => {
            ret.push(toAbsolutePath(path, existing));
          });
        }

        return ret;
      }, [] as string[])
  );

  return resolutionPaths;
}

/**
 * Get the node_modules resolution paths based on the provided paths.
 *
 * @param paths - An array of paths to include in the resolution.
 * @returns An array of unique, corrected node_modules resolution paths.
 */
export function getNodeModulesPaths(paths: string[] = []) {
  return getUnique(
    paths.reduce((ret, path) => {
      if (findFolderName(path) === "node_modules") {
        ret.push(correctPath(path));
      }

      if (existsSync(joinPaths(path, "node_modules"))) {
        ret.push(correctPath(joinPaths(path, "node_modules")));
      }

      return ret;
    }, [] as string[])
  );
}

/**
 * Get all combinations of resolution paths for a given path and options.
 *
 * @param path - The base path to combine with resolution paths.
 * @param options - The options containing resolution paths.
 * @returns An array of unique, corrected resolution paths.
 */
export function getResolutionCombinations(
  path: string,
  options: ResolveOptions = {}
) {
  let paths = getResolutionPaths(options.paths);
  if (isNpmScopedPackage(path)) {
    paths = getNodeModulesPaths(paths);
  } else {
    paths.push(...getNodeModulesPaths(paths));
  }

  const extensions = options.extensions ?? DEFAULT_EXTENSIONS;

  let combinations = paths.map(base => joinPaths(base, path));
  if (findFileName(path, { withExtension: false }) !== "index") {
    combinations = combinations.reduce((ret, combination) => {
      ret.push(combination);
      ret.push(joinPaths(combination, "index"));

      return ret;
    }, [] as string[]);
  }

  if (!findFileExtension(path)) {
    combinations = combinations.reduce((ret, combination) => {
      ret.push(combination);
      extensions.forEach(ext => {
        ret.push(appendExtension(combination, ext));
      });

      return ret;
    }, [] as string[]);
  }

  return getUnique(combinations.filter(Boolean)).map(p => correctPath(p));
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
  let paths = getResolutionPaths(options.paths);
  if (isNpmScopedPackage(path)) {
    paths = getNodeModulesPaths(paths);
  } else {
    paths.push(...getNodeModulesPaths(paths));
  }

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

  // if (!result) {
  //   for (let i = 0; i < paths.length && !result; i++) {
  //     try {
  //       result = await resolvePath(replacePath(path, paths[i]), {
  //         url: paths,
  //         extensions: options.extensions ?? DEFAULT_EXTENSIONS,
  //         conditions: options.conditions
  //       });
  //     } catch (err) {
  //       error = err as Error;
  //     }
  //   }
  // }

  if (!result) {
    throw new Error(
      `Unable to resolve module "${
        path
      }". The following import paths were tried: \n${paths.join("\n")}`,
      {
        cause: error
      }
    );
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
  let paths = getResolutionPaths(options.paths);
  if (isNpmScopedPackage(path)) {
    paths = getNodeModulesPaths(paths);
  } else {
    paths.push(...getNodeModulesPaths(paths));
  }

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

  // if (!result) {
  //   for (let i = 0; i < paths.length && !result; i++) {
  //     try {
  //       result = resolvePathSync(replacePath(path, paths[i]), {
  //         url: paths,
  //         extensions: options.extensions ?? DEFAULT_EXTENSIONS,
  //         conditions: options.conditions
  //       });
  //     } catch (err) {
  //       error = err as Error;
  //     }
  //   }
  // }

  // if (!result && findFileName(path, { withExtension: false }) !== "index") {
  //   try {
  //     result = resolveSync(joinPaths(path, "index"), {
  //       ...options,
  //       paths
  //     });
  //     if (result) {
  //       // Remove the previously added index file from the path
  //       result = findFilePath(result);
  //     }
  //   } catch (err) {
  //     error = err as Error;
  //   }
  // }

  if (!result) {
    throw new Error(
      `Unable to resolve module "${
        path
      }". The following import paths were tried: \n${paths.join("\n")}`,
      {
        cause: error
      }
    );
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
