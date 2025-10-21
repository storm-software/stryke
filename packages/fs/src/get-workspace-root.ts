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

import { findWorkspaceRootSafe } from "@storm-software/config-tools";
import { cwd } from "@stryke/path/cwd";
import { relativePath } from "@stryke/path/file-path-fns";
import { isSystemRoot } from "@stryke/path/is-root-dir";
import { getParentPath } from "./get-parent-path";

export const WORKSPACE_ROOT_CONTENT: string[] = [
  ".all-contributorsrc",
  ".commitlintrc",
  ".github",
  ".git",
  ".husky",
  ".huskyrc",
  ".lintstagedrc",
  ".log4brains.yml",
  ".npmrc",
  ".nx",
  ".storm-workspace.js",
  ".storm-workspace.json",
  ".storm-workspace.ts",
  ".storm-workspace.yaml",
  ".storm-workspace.yml",
  ".vscode",
  ".whitesource",
  "bun.lock",
  "bun.lockb",
  "lefthook.yaml",
  "lefthook.yml",
  "lerna.json",
  "npm-lock.json",
  "npm-lock.yaml",
  "npm-lock.yml",
  "npm-workspace.json",
  "npm-workspace.yaml",
  "npm-workspace.yml",
  "nx.json",
  "package-lock.json",
  "patches",
  "pnpm-lock.json",
  "pnpm-lock.yaml",
  "pnpm-lock.yml",
  "pnpm-workspace.json",
  "pnpm-workspace.yaml",
  "pnpm-workspace.yml",
  "socket.yaml",
  "storm-workspace.js",
  "storm-workspace.json",
  "storm-workspace.ts",
  "storm-workspace.yaml",
  "storm-workspace.yml",
  "syncpack.config.js",
  "syncpack.json",
  "turbo.json",
  "yarn-lock.json",
  "yarn-lock.yaml",
  "yarn-lock.yml",
  "yarn-workspace.json",
  "yarn-workspace.yaml",
  "yarn-workspace.yml",
  "yarn.lock"
] as const;

export const PROJECT_ROOT_CONTENT: string[] = [
  ".powerlines",
  ".storm",
  "package.json",
  "powerlines.json",
  "powerlines.yaml",
  "powerlines.yml",
  "powerlines.toml",
  "powerlines.config.js",
  "powerlines.config.ts",
  "project.json"
] as const;

/**
 * Get the workspace root path
 *
 * @param dir - A directory to start the search from
 * @returns The workspace root path
 */
export function getWorkspaceRoot(dir = cwd()) {
  if (process.env.STORM_WORKSPACE_ROOT || process.env.NX_WORKSPACE_ROOT_PATH) {
    return (process.env.STORM_WORKSPACE_ROOT ||
      process.env.NX_WORKSPACE_ROOT_PATH)!;
  }

  const root = findWorkspaceRootSafe(dir);
  if (root) {
    return root;
  }

  let result = getParentPath(WORKSPACE_ROOT_CONTENT, dir);
  if (result) {
    return result;
  }

  result = dir;
  while (result && !isSystemRoot(result)) {
    result = getParentPath("storm-workspace.json", result, { skipCwd: true });
    if (result) {
      return result;
    }
  }

  return dir;
}

/**
 * Check if the given directory is the workspace root
 *
 * @param dir - A directory to check
 * @returns True if the directory is the workspace root, false otherwise
 */
export function isWorkspaceRoot(dir = cwd()): boolean {
  const workspaceRoot = getWorkspaceRoot(dir);
  if (workspaceRoot) {
    return workspaceRoot === dir;
  }

  return false;
}

/**
 * Get the project root path
 *
 * @param dir - A directory to start the search from
 * @returns The project root path
 */
export function getProjectRoot(dir = cwd()) {
  const result = getParentPath(PROJECT_ROOT_CONTENT, dir);

  if (result) {
    return result;
  }

  return dir;
}

/**
 * Check if the given directory is the project root
 *
 * @param dir - A directory to check
 * @returns True if the directory is the project root, false otherwise
 */
export function isProjectRoot(dir = cwd()): boolean {
  const projectRoot = getProjectRoot(dir);
  if (projectRoot) {
    return projectRoot === dir;
  }

  return false;
}

/**
 * Find the file path relative to the workspace root path.
 *
 * @param filePath - The file path to process
 * @returns The file path relative to the workspace root
 */
export function relativeToWorkspaceRoot(filePath: string) {
  return relativePath(filePath, getWorkspaceRoot());
}

/**
 * Find the file path relative to the project root path.
 *
 * @param filePath - The file path to process
 * @returns The file path relative to the project root
 */
export function relativeToProjectRoot(filePath: string) {
  return relativePath(filePath, getProjectRoot());
}
