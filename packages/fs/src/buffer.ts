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

import { findFilePath } from "@stryke/path";
import { Buffer } from "node:buffer";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createDirectory, createDirectorySync } from "./helpers";

/**
 * Reads a file from the given path and returns its content as an ArrayBuffer. The file is expected to be located relative to the current directory of this module.
 *
 * @param filePath - The path to the file to read.
 * @returns The content of the file as an ArrayBuffer.
 */
export async function readFileBuffer(filePath: string): Promise<ArrayBuffer> {
  if (!filePath) {
    throw new Error("No file path provided to read data");
  }
  if (!existsSync(filePath)) {
    throw new Error(`File does not exist at path: ${filePath}`);
  }

  const b = await readFile(filePath);

  return b.buffer.slice(
    b.byteOffset,
    b.byteOffset + b.byteLength
  ) as ArrayBuffer;
}

/**
 * Reads a file from the given path and returns its content as an ArrayBuffer. The file is expected to be located relative to the current directory of this module.
 *
 * @param filePath - The path to the file to read.
 * @returns The content of the file as an ArrayBuffer.
 */
export function readFileBufferSync(filePath: string): ArrayBuffer {
  if (!filePath) {
    throw new Error("No file path provided to read data");
  }
  if (!existsSync(filePath)) {
    throw new Error(`File does not exist at path: ${filePath}`);
  }

  const b = readFileSync(filePath);

  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

/**
 * Writes an ArrayBuffer to a file at the specified path.
 *
 * @param filePath - The path to the file where the data should be written.
 * @param data - The ArrayBuffer containing the data to write.
 */
export async function writeFileBuffer(filePath: string, data: ArrayBuffer) {
  if (!filePath) {
    throw new Error("No file path provided to write data");
  }
  if (!existsSync(findFilePath(filePath))) {
    await createDirectory(findFilePath(filePath));
  }

  await writeFile(filePath, Buffer.from(data));
}

/**
 * Writes an ArrayBuffer to a file at the specified path.
 *
 * @param filePath - The path to the file where the data should be written.
 * @param data - The ArrayBuffer containing the data to write.
 */
export function writeFileBufferSync(filePath: string, data: ArrayBuffer) {
  if (!filePath) {
    throw new Error("No file path provided to write data");
  }
  if (!existsSync(findFilePath(filePath))) {
    createDirectorySync(findFilePath(filePath));
  }

  writeFileSync(filePath, Buffer.from(data));
}
