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

import { type DotenvPopulateInput, parse } from "@dotenvx/dotenvx";
import { readFile } from "@stryke/fs/files/read-file";
import { StormJSON } from "@stryke/json";
import { existsSync, joinPaths } from "@stryke/path";
import defu from "defu";
import { type DotenvParseOutput, ENV_PREFIXES } from "./types";

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
      ).map(envFilePath => {
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
 * @param mode - The mode to load the environment variables for.
 * @param envDir - The directory/directories to load the environment variables from.
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

  const prefixes = prefix ? (Array.isArray(prefix) ? prefix : [prefix]) : [];
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
      envFiles.map(filePath => {
        return loadEnvFile(filePath);
      })
    )
  ).reduce((ret, result) => {
    return defu(result, ret);
  }, {});

  // test NODE_ENV override before expand as otherwise process.env.NODE_ENV would override this
  if (envParsed.NODE_ENV && process.env.VITE_USER_NODE_ENV === undefined) {
    process.env.VITE_USER_NODE_ENV = StormJSON.stringify(envParsed.NODE_ENV);
  }
  // support BROWSER and BROWSER_ARGS env variables
  if (envParsed.BROWSER && process.env.BROWSER === undefined) {
    process.env.BROWSER = StormJSON.stringify(envParsed.BROWSER);
  }
  if (envParsed.BROWSER_ARGS && process.env.BROWSER_ARGS === undefined) {
    process.env.BROWSER_ARGS = StormJSON.stringify(envParsed.BROWSER_ARGS);
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
 * @param mode - The mode to load the environment variables for.
 * @param envDir - The directory/directories to load the environment variables from.
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
 * @param mode - The mode to load the environment variables for.
 * @param envDir - The directory/directories to load the environment variables from.
 * @returns The environment variables.
 */
export async function loadServerEnv(
  envDir: string | string[],
  mode: string
): Promise<DotenvParseOutput> {
  return loadEnv(envDir, mode);
}
