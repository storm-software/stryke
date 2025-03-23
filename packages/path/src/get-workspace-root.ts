/* -------------------------------------------------------------------

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

 ------------------------------------------------------------------- */

import { findWorkspaceRootSafe } from "@storm-software/config-tools";
import { getParentPath } from "./get-parent-path";
import { isSystemRoot } from "./is-root-dir";

/**
 * Get the workspace root path
 *
 * @param dir - A directory to start the search from
 * @returns The workspace root path
 */
export const getWorkspaceRoot = (dir = process.cwd()) => {
  if (process.env.STORM_WORKSPACE_ROOT || process.env.NX_WORKSPACE_ROOT_PATH) {
    return (process.env.STORM_WORKSPACE_ROOT ||
      process.env.NX_WORKSPACE_ROOT_PATH)!;
  }

  const root = findWorkspaceRootSafe(dir);
  if (root) {
    return root;
  }

  let result = getParentPath(
    [
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
    ],
    dir
  );

  if (result) {
    return result;
  }

  result = dir;
  while (result && !isSystemRoot(result)) {
    result = getParentPath("storm.json", result, { skipCwd: true });
    if (result) {
      return result;
    }
  }

  return dir;
};

/**
 * Get the project root path
 *
 * @param dir - A directory to start the search from
 * @returns The project root path
 */
export const getProjectRoot = (dir = process.cwd()) => {
  const result = getParentPath(["project.json", "package.json", ".storm"], dir);

  if (result) {
    return result;
  }

  return dir;
};
