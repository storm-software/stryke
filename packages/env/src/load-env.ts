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

import type { DotenvPopulateInput } from "@dotenvx/dotenvx";
import { parse } from "@dotenvx/dotenvx";
import { toArray } from "@stryke/convert/to-array";
import { existsSync } from "@stryke/fs/exists";
import { readFile } from "@stryke/fs/read-file";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import type { DotenvParseOutput } from "./types";
import { ENV_PREFIXES } from "./types";

export function getEnvFilesForMode(
  envDir: string,
  mode = "production"
): string[] {
  return [
    /** default file */ ".env",
    /** local file */ ".env.local",
    /** mode file */ `.env.${mode}`,
    /** mode local file */ `.env.${mode}.local`,
    /** local mode file */ `.env.local.${mode}`
  ].map(file => joinPaths(envDir, file));
}

/**
 * Load environment variables from a .env file.
 *
 * @param envFile - The path to the .env file.
 * @returns The environment variables.
 */
export async function loadEnvFile(
  envFile: string,
  envDir: string | string[] = []
): Promise<DotenvParseOutput> {
  const envDirs = Array.isArray(envDir) ? envDir : [envDir];

  return (
    await Promise.all(
      (envDir.length > 0
        ? envDirs.map(envDir => joinPaths(envDir, envFile))
        : [envFile]
      ).map(async envFilePath => {
        if (!existsSync(envFilePath)) {
          return undefined;
        }

        return readFile(envFilePath);
      })
    )
  ).reduce((ret, envFileContent) => {
    if (!envFileContent) {
      return ret;
    }

    const result = parse(envFileContent, {
      processEnv: { ...process.env } as DotenvPopulateInput,
      privateKey:
        process.env.DOTENV_PRIVATE_KEY || process.env.STORM_PRIVATE_KEY
    });

    return defu(result, ret);
  }, {});
}

/**
 * Load environment variables from .env files.
 *
 * @remarks
 * This function loads environment variables from .env files based on the mode. For the `production` mode, it will load:
 * - `.env`
 * - `.env.local`
 * - `.env.production`
 * - `.env.production.local`
 *
 * @param envDir - The directory/directories to load the environment variables from.
 * @param mode - The mode to load the environment variables for.
 * @param prefix - The prefix or prefixes to use for the environment variables.
 * @returns The environment variables.
 */
export async function loadEnv(
  envDir: string | string[],
  mode?: string,
  prefix?: string | string[]
): Promise<DotenvParseOutput> {
  if (mode === "local") {
    throw new Error(
      '"local" cannot be used as a mode name because it conflicts with ' +
        "the .local postfix for .env files."
    );
  }

  const prefixes = toArray(prefix).reduce((ret, pre) => {
    if (!pre) {
      return ret;
    }

    if (!ret.includes(pre.endsWith("_") ? pre : `${pre}_`)) {
      ret.push(pre.endsWith("_") ? pre : `${pre}_`);
    }
    if (!ret.includes(`${pre.endsWith("_") ? pre : `${pre}_`}PUBLIC_`)) {
      ret.push(`${pre.endsWith("_") ? pre : `${pre}_`}PUBLIC_`);
    }
    return ret;
  }, [] as string[]);
  const envDirs = Array.isArray(envDir) ? envDir : [envDir];

  const env: DotenvParseOutput = {};
  const envFiles = envDirs.reduce((ret, envFilePath) => {
    ret.push(
      ...getEnvFilesForMode(envFilePath, mode).filter(
        envFile => !ret.includes(envFile)
      )
    );

    return ret;
  }, [] as string[]);

  let envParsed = (
    await Promise.all(
      envFiles.map(async filePath => {
        return loadEnvFile(filePath);
      })
    )
  ).reduce((ret, result) => {
    return defu(result, ret);
  }, {});

  // test NODE_ENV override before expand as otherwise process.env.NODE_ENV would override this
  if (envParsed.NODE_ENV && process.env.VITE_USER_NODE_ENV === undefined) {
    process.env.VITE_USER_NODE_ENV = JSON.stringify(envParsed.NODE_ENV);
  }
  // support BROWSER and BROWSER_ARGS env variables
  if (envParsed.BROWSER && process.env.BROWSER === undefined) {
    process.env.BROWSER = JSON.stringify(envParsed.BROWSER);
  }
  if (envParsed.BROWSER_ARGS && process.env.BROWSER_ARGS === undefined) {
    process.env.BROWSER_ARGS = JSON.stringify(envParsed.BROWSER_ARGS);
  }

  // let environment variables use each other. make a copy of `process.env` so that we do not mutate the global `process.env`.
  envParsed = defu({ ...process.env }, envParsed);
  if (prefixes.length === 0) {
    return envParsed;
  }

  // only keys that start with prefix are exposed to client
  for (const [key, value] of Object.entries(envParsed)) {
    if (prefixes.some(prefix => key.startsWith(prefix))) {
      env[key] = String(value);
    }
  }

  // check if there are actual env variables starting with VITE_*
  // these are typically provided inline and should be prioritized
  for (const key in process.env) {
    if (prefixes.some(prefix => key.startsWith(prefix))) {
      env[key] = process.env[key] as string;
    }
  }

  return env;
}

/**
 * Load environment variables from .env files for a client-side environment.
 *
 * @remarks
 * This function loads environment variables from .env files based on the mode. For the `production` mode, it will load:
 * - `.env`
 * - `.env.local`
 * - `.env.production`
 * - `.env.production.local`
 *
 * @param envDir - The directory/directories to load the environment variables from.
 * @param mode - The mode to load the environment variables for.
 * @param prefix - The prefix or prefixes to use for the environment variables.
 * @returns The environment variables.
 */
export async function loadClientEnv(
  envDir: string | string[],
  mode?: string,
  prefix: string | string[] = ENV_PREFIXES
): Promise<DotenvParseOutput> {
  return loadEnv(envDir, mode, prefix);
}

/**
 * Load environment variables from .env files for a server-side environment.
 *
 * @remarks
 * This function loads environment variables from .env files based on the mode. For the `production` mode, it will load:
 * - `.env`
 * - `.env.local`
 * - `.env.production`
 * - `.env.production.local`
 *
 * @param envDir - The directory/directories to load the environment variables from.
 * @param mode - The mode to load the environment variables for.
 * @returns The environment variables.
 */
export async function loadServerEnv(
  envDir: string | string[],
  mode: string
): Promise<DotenvParseOutput> {
  return loadEnv(envDir, mode);
}
