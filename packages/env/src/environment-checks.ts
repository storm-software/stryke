/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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

import { isCI } from "./ci-checks";

const proc = typeof process !== "undefined" ? process : undefined;

/** Value of process.platform */
export const platform = proc?.platform || "";

/** Detect if stdout.TTY is available */
export const hasTTY = Boolean(proc?.stdout?.isTTY);

const readEnv = (read: () => string | undefined) => {
  try {
    return read();
  } catch {
    return undefined;
  }
};

/** Detect if `DEBUG` environment variable is set */
export const isDebug = Boolean(
  readEnv(() => process.env.DEBUG)
);

/** Detect the `NODE_ENV` environment variable */
const mode =
  readEnv(() => process.env.STORM_MODE) ||
  readEnv(() => process.env.NEXT_PUBLIC_VERCEL_ENV) ||
  readEnv(() => process.env.NODE_ENV) ||
  "production";

/** Detect if the application is running in a staging environment */
export const isStaging = ["stg", "stage", "staging"].includes(
  mode?.toLowerCase()
);

/**
 * Check if the current environment is production.
 *
 * @param mode - The mode string to check.
 * @returns Whether the environment is production
 */
export function isProductionMode(mode: string) {
  return [
    "prd",
    "prod",
    "production",

    "preprod",

    "preproduction",
    "uat"
  ].includes(mode?.toLowerCase()?.replace(/[\s\-_]/g, ""));
}

/** Detect if `NODE_ENV` environment variable is `production` */
export const isProduction = isProductionMode(mode);

/**
 * Check if the current environment is test.
 *
 * @param mode - The mode string to check.
 * @returns Whether the environment is test
 */
export function isTestMode(mode: string) {
  return [
    "tst",
    "test",
    "testing",
    "stg",
    "stage",
    "staging",
    "qa",

    "qualityassurance"
  ].includes(mode?.toLowerCase()?.replace(/[\s\-_]/g, ""));
}

/** Detect if `NODE_ENV` environment variable is `test` */
export const isTest =
  isTestMode(mode) || isStaging || Boolean(readEnv(() => process.env.TEST));

/**
 * Check if the current environment is development.
 *
 * @param mode - The mode string to check.
 * @returns Whether the environment is development
 */
export function isDevelopmentMode(mode: string) {
  return ["dev", "development", "int", "integration"].includes(
    mode?.toLowerCase()?.replace(/[\s\-_]/g, "")
  );
}

/** Detect if `NODE_ENV` environment variable is `dev` or `development` */
export const isDevelopment = isDevelopmentMode(mode) || isDebug;

/**
 * Convert a mode string to a standardized mode value of "production", "development", or "test".
 *
 * @param mode - The mode string to convert.
 * @returns The standardized mode value.
 */
export function toMode(mode: string): "production" | "development" | "test" {
  if (isProductionMode(mode)) {
    return "production";
  } else if (isTestMode(mode)) {
    return "test";
  } else if (isDevelopmentMode(mode)) {
    return "development";
  }

  return "production";
}

/** Detect if MINIMAL environment variable is set, running in CI or test or TTY is unavailable */
export const isMinimal =
  Boolean(readEnv(() => process.env.MINIMAL)) || isCI() || isTest || !hasTTY;

/** Detect if process.platform is Windows */
export const isWindows = /^win/i.test(platform);

/** Detect if process.platform is Linux */
export const isLinux = /^linux/i.test(platform);

/** Detect if process.platform is macOS (darwin kernel) */
export const isMacOS = /^darwin/i.test(platform);

/** Color Support */
export const isColorSupported =
  !readEnv(() => process.env.NO_COLOR) &&
  (Boolean(readEnv(() => process.env.FORCE_COLOR)) ||
    ((hasTTY || isWindows) && readEnv(() => process.env.TERM) !== "dumb") ||
    isCI());

function parseVersion(versionString = "") {
  if (/^\d{3,4}$/.test(versionString)) {
    const match = /(\d{1,2})(\d{2})/.exec(versionString) ?? [];

    return {
      major: 0,
      minor: Number.parseInt(match[1]!, 10),
      patch: Number.parseInt(match[2]!, 10)
    };
  }

  const versions = (versionString ?? "")
    .split(".")
    .map(n => Number.parseInt(n, 10));

  return {
    major: versions[0],
    minor: versions[1],
    patch: versions[2]
  };
}

/**
 * Check if the current environment supports hyperlinks in the terminal.
 *
 * @param stream - The stream to check for TTY support (default: process.stdout)
 * @returns Whether hyperlinks are supported
 */
export function isHyperlinkSupported(
  stream: NodeJS.WriteStream | undefined = proc?.stdout
): boolean {
  if (!proc) {
    return false;
  }

  const forceHyperlink = readEnv(() => process.env.FORCE_HYPERLINK);
  if (forceHyperlink) {
    return !(
      forceHyperlink.length > 0 &&
      Number.parseInt(forceHyperlink, 10) === 0
    );
  }

  // Netlify does not run a TTY, it does not need `supportsColor` check
  if (readEnv(() => process.env.NETLIFY)) {
    return true;
  } else if (!isColorSupported) {
    return false;
  } else if (stream && !stream.isTTY) {
    return false;
  } else if ("WT_SESSION" in proc.env) {
    return true;
  } else if (proc.platform === "win32") {
    return false;
  } else if (isCI()) {
    return false;
  } else if (readEnv(() => process.env.TEAMCITY_VERSION)) {
    return false;
  } else if (readEnv(() => process.env.TERM_PROGRAM)) {
    const termProgram = readEnv(() => process.env.TERM_PROGRAM);
    const termProgramVersion = readEnv(() => process.env.TERM_PROGRAM_VERSION);
    const version = parseVersion(termProgramVersion);

    switch (termProgram) {
      case "iTerm.app": {
        if (version.major === 3) {
          return version.minor !== undefined && version.minor >= 1;
        }

        return version.major !== undefined && version.major > 3;
      }
      case "WezTerm": {
        return version.major !== undefined && version.major >= 20_200_620;
      }
      case "vscode": {
        // Cursor forked VS Code and supports hyperlinks in 0.x.x
        if (readEnv(() => process.env.CURSOR_TRACE_ID)) {
          return true;
        }

        return (
          version.minor !== undefined &&
          version.major !== undefined &&
          (version.major > 1 || (version.major === 1 && version.minor >= 72))
        );
      }
      case "ghostty": {
        return true;
      }
    }
  }

  const vteVersion = readEnv(() => process.env.VTE_VERSION);
  if (vteVersion) {
    // 0.50.0 was supposed to support hyperlinks, but throws a segfault
    if (vteVersion === "0.50.0") {
      return false;
    }

    const version = parseVersion(vteVersion);

    return (
      (version.major !== undefined && version.major > 0) ||
      (version.minor !== undefined && version.minor >= 50)
    );
  }

  if (readEnv(() => process.env.TERM) === "alacritty") {
    return true;
  }

  return false;
}

/** Node.js versions */
export const nodeVersion =
  (proc?.versions?.node || "").replace(/^v/, "") || null;

export const nodeMajorVersion = Number(nodeVersion?.split(".")[0]) || null;
