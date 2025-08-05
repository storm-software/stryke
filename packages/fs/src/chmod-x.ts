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

import { accessSync, chmodSync, constants, statSync } from "node:fs";
import { access, chmod } from "node:fs/promises";

/**
 * Adds execute permissions to a file
 *
 * @param file - The file to add execute permissions to
 */
export function chmodXSync(file: string) {
  // Note: skip for windows as chmod does on exist there
  // and will error with `EACCES: permission denied`
  if (process.platform === "win32") {
    return;
  }

  const s = statSync(file);
  const newMode = s.mode | 64 | 8 | 1;

  if (s.mode === newMode) {
    return;
  }
  const base8 = newMode.toString(8).slice(-3);

  chmodSync(file, base8);
}

/**
 * Adds execute permissions to a file
 *
 * @param file - The file to add execute permissions to
 */
export async function chmodX(file: string) {
  // Note: skip for windows as chmod does on exist there
  // and will error with `EACCES: permission denied`
  if (process.platform === "win32") {
    return;
  }

  const s = statSync(file);
  const newMode = s.mode | 64 | 8 | 1;

  if (s.mode === newMode) {
    return;
  }
  const base8 = newMode.toString(8).slice(-3);

  return chmod(file, base8);
}

/**
 * Checks the write permission of a file
 *
 * @param filename - The file to check the permission of
 * @returns A promise that resolves to true if the file is writable, false otherwise
 */
export async function isWritable(filename: string): Promise<boolean> {
  try {
    await access(filename, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks the write permission of a file
 *
 * @param filename - The file to check the permission of
 * @returns True if the file is writable, false otherwise
 */
export function isWritableSync(filename: string): boolean {
  try {
    accessSync(filename, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks the execute permission of a file
 *
 * @param filename - The file to check the permission of
 * @returns A promise that resolves to true if the file is executable, false otherwise
 */
export async function isExecutable(filename: string): Promise<boolean> {
  try {
    await access(filename, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks the execute permission of a file
 *
 * @param filename - The file to check the permission of
 * @returns True if the file is executable, false otherwise
 */
export function isExecutableSync(filename: string): boolean {
  try {
    accessSync(filename, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
