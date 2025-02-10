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

import { isCI } from "./ci-checks";

/** Value of process.platform */
export const platform = globalThis.process?.platform || "";

/** Detect if stdout.TTY is available */
export const hasTTY = Boolean(
  globalThis.process?.stdout && globalThis.process?.stdout.isTTY
);

/** Detect if `DEBUG` environment variable is set */
export const isDebug = Boolean(process.env.DEBUG);

/** Detect if `NODE_ENV` environment variable is `test` */
const nodeEnv = process.env.STORM_MODE || process.env.NODE_ENV || "production";

/** Detect if `NODE_ENV` environment variable is `production` */
export const isProduction = ["prd", "prod", "production"].includes(
  nodeEnv?.toLowerCase()
);

/** Detect if `NODE_ENV` environment variable is `production` */
export const isStaging = ["stg", "stage", "staging"].includes(
  nodeEnv?.toLowerCase()
);

/** Detect if `NODE_ENV` environment variable is `dev` or `development` */
export const isDevelopment = ["dev", "development"].includes(
  nodeEnv?.toLowerCase()
);

/** Detect if `NODE_ENV` environment variable is `test` */
export const isTest =
  ["tst", "test", "testing"].includes(nodeEnv?.toLowerCase()) ||
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

/** Node.js versions */
export const nodeVersion =
  (globalThis.process?.versions?.node || "").replace(/^v/, "") || null;
export const nodeMajorVersion = Number(nodeVersion?.split(".")[0]) || null;
