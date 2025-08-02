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
import { getParentPath } from "./get-parent-path";
import { isSystemRoot } from "./is-root-dir";

export const WORKSPACE_ROOT_CONTENT: string[] = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lock",
  "nx.json",
  "knip.json",
  "pnpm-workspace.yaml",
  "LICENSE",
  ".all-contributorsrc",
  ".whitesource",
  "syncpack.config.js",
  "syncpack.json",
  "socket.yaml",
  "lefthook.yaml",
  ".npmrc",
  ".log4brains.yml",
  ".huskyrc",
  ".husky",
  ".lintstagedrc",
  ".commitlintrc",
  "lefthook.yml",
  ".github",
  ".nx",
  ".vscode",
  "patches"
] as const;

export const PROJECT_ROOT_CONTENT: string[] = [
  "project.json",
  "package.json",
  ".storm"
] as const;

/**
 * Get the workspace root path
 *
 * @param dir - A directory to start the search from
 * @returns The workspace root path
 */
export function getWorkspaceRoot(dir = process.cwd()) {
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
export function isWorkspaceRoot(dir: string = process.cwd()): boolean {
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
export function getProjectRoot(dir = process.cwd()) {
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
export function isProjectRoot(dir: string = process.cwd()): boolean {
  const projectRoot = getProjectRoot(dir);
  if (projectRoot) {
    return projectRoot === dir;
  }

  return false;
}
