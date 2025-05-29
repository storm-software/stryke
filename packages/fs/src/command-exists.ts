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

import { exec, execSync } from "node:child_process";
import { accessSync } from "node:fs";
import { access, constants } from "node:fs/promises";
import { basename, dirname } from "node:path";

const isUsingWindows = process.platform == "win32";

async function fileNotExists(commandName: string) {
  try {
    await access(commandName, constants.F_OK);
    return false;
    // eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
  } catch (_) {
    return true;
  }
}

function fileNotExistsSync(commandName: string) {
  try {
    accessSync(commandName, constants.F_OK);
    return false;
    // eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
  } catch (_) {
    return true;
  }
}

async function localExecutable(commandName: string) {
  return access(commandName, constants.F_OK | constants.X_OK);
}

function localExecutableSync(commandName: string) {
  try {
    accessSync(commandName, constants.F_OK | constants.X_OK);
    return true;
    // eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
  } catch (_) {
    return false;
  }
}

async function commandExistsUnix(
  commandName: string,
  cleanedCommandName: string
) {
  const isFile = await fileNotExists(commandName);

  if (!isFile) {
    exec(
      `command -v ${cleanedCommandName} 2>/dev/null` +
        ` && { echo >&1 ${cleanedCommandName}; exit 0; }`
    );

    await localExecutable(commandName);
  }
}

async function commandExistsWindows(
  commandName: string,
  cleanedCommandName: string
) {
  // Regex from Julio from: https://stackoverflow.com/questions/51494579/regex-windows-path-validator
  if (!/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-z]:)?[^<>:"|?*\n]+$/im.test(commandName)) {
    return;
  }

  exec(`where ${cleanedCommandName}`);
}

function commandExistsUnixSync(
  commandName: string,
  cleanedCommandName: string
): boolean {
  if (fileNotExistsSync(commandName)) {
    try {
      const stdout = execSync(
        `command -v ${cleanedCommandName} 2>/dev/null` +
          ` && { echo >&1 ${cleanedCommandName}; exit 0; }`
      );

      return !!stdout;
      // eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
    } catch (_) {
      return false;
    }
  }
  return localExecutableSync(commandName);
}

function commandExistsWindowsSync(
  commandName: string,
  cleanedCommandName: string
) {
  // Regex from Julio from: https://stackoverflow.com/questions/51494579/regex-windows-path-validator
  if (!/^(?!(?:.*\s|.*\.|\W+)$)(?:[a-z]:)?[^<>:"|?*\n]+$/im.test(commandName)) {
    return false;
  }
  try {
    const stdout = execSync(`where ${cleanedCommandName}`, { stdio: [] });

    return !!stdout;
    // eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
  } catch (_) {
    return false;
  }
}

function cleanInput(s: string) {
  if (/[^\w/:=-]/.test(s)) {
    s = `'${s.replace(/'/g, "'\\''")}'`;
    s = s
      .replace(/^(?:'')+/g, "") // un-duplicate single-quote at the beginning
      .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
  }
  return s;
}

const cleanWindowsInput = (s: string) => {
  const isPathName = /\\/.test(s);
  if (isPathName) {
    return `"${dirname(s)}:${basename(s)}"`;
  }
  return `"${s}"`;
};

/**
 * Asynchronously checks if a command exists in the system.
 *
 * @remarks
 * This function will check if the command is available in the system's PATH and if it is executable.
 * @param commandName - The name of the command to check for existence
 * @returns A promise that resolves to `true` if the command exists and is executable, `false` otherwise
 */
export async function commandExists(commandName: string) {
  const cleanedCommandName = cleanInput(commandName);

  if (typeof Promise !== "undefined") {
    return commandExists(commandName);
  }
  if (isUsingWindows) {
    return commandExistsWindows(commandName, cleanedCommandName);
  } else {
    return commandExistsUnix(commandName, cleanedCommandName);
  }
}

/**
 * Synchronously checks if a command exists in the system.
 *
 * @remarks
 * This function will check if the command is available in the system's PATH and if it is executable.
 * @param commandName - The name of the command to check for existence
 * @returns `true` if the command exists and is executable, `false` otherwise
 */
export function commandExistsSync(commandName: string): boolean {
  if (isUsingWindows) {
    return commandExistsWindowsSync(
      commandName,
      cleanWindowsInput(commandName)
    );
  } else {
    return commandExistsUnixSync(commandName, cleanInput(commandName));
  }
}
