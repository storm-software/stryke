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

import { isCI } from "./ci-checks";

/** Value of process.platform */
export const platform = process?.platform || "";

/** Detect if stdout.TTY is available */
export const hasTTY = Boolean(process?.stdout && process?.stdout.isTTY);

/** Detect if `DEBUG` environment variable is set */
export const isDebug = Boolean(process.env.DEBUG);

/** Detect the `NODE_ENV` environment variable */
const mode =
  process.env.STORM_MODE ||
  process.env.NEXT_PUBLIC_VERCEL_ENV ||
  process.env.NODE_ENV ||
  "production";

/** Detect if `NODE_ENV` environment variable is `production` */
export const isProduction = ["prd", "prod", "production"].includes(
  mode?.toLowerCase()
);

/** Detect if `NODE_ENV` environment variable is `production` */
export const isStaging = ["stg", "stage", "staging"].includes(
  mode?.toLowerCase()
);

/** Detect if `NODE_ENV` environment variable is `dev` or `development` */
export const isDevelopment = ["dev", "development"].includes(
  mode?.toLowerCase()
);

/** Detect if `NODE_ENV` environment variable is `test` */
export const isTest =
  ["tst", "test", "testing"].includes(mode?.toLowerCase()) ||
  isStaging ||
  Boolean(process.env.TEST);

/** Detect if MINIMAL environment variable is set, running in CI or test or TTY is unavailable */
export const isMinimal =
  Boolean(process.env.MINIMAL) || isCI() || isTest || !hasTTY;

/** Detect if process.platform is Windows */
export const isWindows = /^win/i.test(platform);

/** Detect if process.platform is Linux */
export const isLinux = /^linux/i.test(platform);

/** Detect if process.platform is macOS (darwin kernel) */
export const isMacOS = /^darwin/i.test(platform);

/** Color Support */
export const isColorSupported =
  !process.env.NO_COLOR &&
  (Boolean(process.env.FORCE_COLOR) ||
    ((hasTTY || isWindows) && process.env.TERM !== "dumb") ||
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
  stream: NodeJS.WriteStream = process.stdout
): boolean {
  if (process.env.FORCE_HYPERLINK) {
    return !(
      process.env.FORCE_HYPERLINK.length > 0 &&
      Number.parseInt(process.env.FORCE_HYPERLINK, 10) === 0
    );
  }

  // Netlify does not run a TTY, it does not need `supportsColor` check
  if (process.env.NETLIFY) {
    return true;
  } else if (!isColorSupported) {
    return false;
  } else if (stream && !stream.isTTY) {
    return false;
  } else if ("WT_SESSION" in process.env) {
    return true;
  } else if (process.platform === "win32") {
    return false;
  } else if (isCI()) {
    return false;
  } else if (process.env.TEAMCITY_VERSION) {
    return false;
  } else if (process.env.TERM_PROGRAM) {
    const version = parseVersion(process.env.TERM_PROGRAM_VERSION);

    switch (process.env.TERM_PROGRAM) {
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
        if (process.env.CURSOR_TRACE_ID) {
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

  if (process.env.VTE_VERSION) {
    // 0.50.0 was supposed to support hyperlinks, but throws a segfault
    if (process.env.VTE_VERSION === "0.50.0") {
      return false;
    }

    const version = parseVersion(process.env.VTE_VERSION);

    return (
      (version.major !== undefined && version.major > 0) ||
      (version.minor !== undefined && version.minor >= 50)
    );
  }

  if (process.env.TERM === "alacritty") {
    return true;
  }

  return false;
}

/** Node.js versions */
export const nodeVersion =
  (process?.versions?.node || "").replace(/^v/, "") || null;

export const nodeMajorVersion = Number(nodeVersion?.split(".")[0]) || null;
