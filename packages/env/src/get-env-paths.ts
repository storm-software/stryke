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

import { joinPaths } from "@stryke/path/join-paths";
import { titleCase } from "@stryke/string-format/title-case";
import { isString } from "@stryke/type-checks/is-string";
import os from "node:os";
import path from "node:path";

// Forked from https://www.npmjs.com/package/env-paths

const homedir = os.homedir();
const tmpdir = os.tmpdir();

/**
 * Options for the `getEnvPaths` function.
 */
export interface GetEnvPathsOptions {
  /**
   * The name of the organization
   *
   * @defaultValue "storm-software"
   */
  orgId?: string;

  /**
   * The name of the specific application to use as a nested folder inside the organization's folder
   *
   * For example: `~/ ... /storm-software/Log/<appId>`
   */
  appId?: string;

  /**
   * The name of the specific application to use as a nested folder inside the organization's folder
   *
   * When a value is provided, it will use `~/ ... /storm-software/Log/<appId>/<nestedDir>`
   *
   * @remarks
   * If no child is provided, it will use `~/ ... /storm-software/Log/<appId>`
   */
  nestedDir?: string;

  /**
   * The suffix to append to the project name.
   *
   * @remarks
   * If `suffix` is `true`, the project name will be suffixed with `"nodejs"`.
   *
   * @defaultValue false
   */
  suffix?: string | boolean | null;

  /**
   * The root directory of the workspace that is used for determining the `cache` and `tmp` paths if they were not already set by other means.
   */
  workspaceRoot?: string;
}

export interface EnvPaths {
  data: string;
  config: string;
  cache: string;
  log: string;
  temp: string;
}

const macos = (orgId: string): EnvPaths => {
  const library = joinPaths(homedir, "Library");

  return {
    data: joinPaths(library, "Application Support", orgId),
    config: joinPaths(library, "Preferences", orgId),
    cache: joinPaths(library, "Caches", orgId),
    log: joinPaths(library, "Logs", orgId),
    temp: joinPaths(tmpdir, orgId)
  };
};

const windows = (orgId: string): EnvPaths => {
  const appData =
    process.env.APPDATA || joinPaths(homedir, "AppData", "Roaming");
  const localAppData =
    process.env.LOCALAPPDATA || joinPaths(homedir, "AppData", "Local");

  const windowsFormattedOrgId = titleCase(orgId).trim().replace(/\s+/g, "");

  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: joinPaths(localAppData, windowsFormattedOrgId, "Data"),
    config: joinPaths(appData, windowsFormattedOrgId, "Config"),
    cache: joinPaths(localAppData, "Cache", orgId),
    log: joinPaths(localAppData, windowsFormattedOrgId, "Log"),
    temp: joinPaths(tmpdir, orgId)
  };
};

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const linux = (orgId: string): EnvPaths => {
  const username = path.basename(homedir);

  return {
    data: joinPaths(
      process.env.XDG_DATA_HOME || joinPaths(homedir, ".local", "share"),
      orgId
    ),
    config: joinPaths(
      process.env.XDG_CONFIG_HOME || joinPaths(homedir, ".config"),
      orgId
    ),
    cache: joinPaths(
      process.env.XDG_CACHE_HOME || joinPaths(homedir, ".cache"),
      orgId
    ),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: joinPaths(
      process.env.XDG_STATE_HOME || joinPaths(homedir, ".local", "state"),
      orgId
    ),
    // https://devenv.sh/files-and-variables/#devenv_root
    temp:
      process.env.DEVENV_RUNTIME || process.env.XDG_RUNTIME_DIR
        ? joinPaths(
            (process.env.DEVENV_RUNTIME || process.env.XDG_RUNTIME_DIR)!,
            orgId
          )
        : joinPaths(tmpdir, username, orgId)
  };
};

/**
 * Get paths for storing things like data, config, logs, and cache in the current runtime environment.
 *
 * @remarks
 * On macOS, directories are generally created in `~/Library/Application Support/<name>`.
 * On Windows, directories are generally created in `%AppData%/<name>`.
 * On Linux, directories are generally created in `~/.config/<name>` - this is determined via the [XDG Base Directory spec](https://specifications.freedesktop.org/basedir-spec/latest/).
 *
 * If the `STORM_DATA_DIR`, `STORM_CONFIG_DIR`, `STORM_CACHE_DIR`, `STORM_LOG_DIR`, or `STORM_TEMP_DIR` environment variables are set, they will be used instead of the default paths.
 *
 * @param options - Parameters used to determine the specific paths for the current project/runtime environment
 * @returns An object containing the various paths for the runtime environment
 */
export function getEnvPaths(options: GetEnvPathsOptions = {}): EnvPaths {
  let orgId = options.orgId || "storm-software";
  if (!orgId) {
    throw new Error(
      "You need to provide an orgId to the `getEnvPaths` function"
    );
  }

  if (options.suffix) {
    // Add suffix to prevent possible conflict with native apps
    orgId += `-${isString(options.suffix) ? options.suffix : "nodejs"}`;
  }

  let result = {} as EnvPaths;

  if (process.platform === "darwin") {
    result = macos(orgId);
  } else if (process.platform === "win32") {
    result = windows(orgId);
  } else {
    result = linux(orgId);
  }

  if (process.env.STORM_DATA_DIR) {
    result.data = process.env.STORM_DATA_DIR;
  } else if (process.env.STORM_CONFIG_DIR) {
    result.config = process.env.STORM_CONFIG_DIR;
  } else if (process.env.STORM_CACHE_DIR) {
    result.cache = process.env.STORM_CACHE_DIR;
  } else if (process.env.STORM_LOG_DIR) {
    result.log = process.env.STORM_LOG_DIR;
  } else if (process.env.STORM_TEMP_DIR) {
    result.temp = process.env.STORM_TEMP_DIR;
  }

  if (options.workspaceRoot) {
    result.cache ??= joinPaths(
      options.workspaceRoot,
      "node_modules",
      ".cache",
      orgId
    );
    result.temp ??= joinPaths(options.workspaceRoot, "tmp", orgId);
    result.log ??= joinPaths(result.temp, "logs");
    result.config ??= joinPaths(options.workspaceRoot, ".config", orgId);
  }

  return Object.keys(result).reduce((ret, key) => {
    if (result[key as keyof EnvPaths]) {
      const filePath = result[key as keyof EnvPaths];

      ret[key as keyof EnvPaths] =
        options.appId &&
        options.appId !== options.orgId &&
        options.appId !== options.nestedDir
          ? joinPaths(filePath, options.appId)
          : filePath;

      if (
        options.nestedDir &&
        options.nestedDir !== options.orgId &&
        options.nestedDir !== options.appId
      ) {
        ret[key as keyof EnvPaths] = joinPaths(
          ret[key as keyof EnvPaths],
          options.nestedDir
        );
      }
    }

    return ret;
  }, {} as EnvPaths);
}
