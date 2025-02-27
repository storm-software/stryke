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

import { createWriteStream, mkdirSync, rmdirSync } from "node:fs";
import { mkdir, readFile, rmdir } from "node:fs/promises";
import { exists, existsSync } from "@stryke/path/utilities/exists";
import { parseTar, parseTarGzip } from "nanotar";

/**
 * Create a directory if it does not exist.
 *
 * @param path - The directory path to check
 * @returns An indicator specifying if the directory exists
 */
export function createDirectorySync(path: string) {
  if (existsSync(path)) {
    return;
  }

  return mkdirSync(path, { recursive: true });
}

/**
 * Create a directory if it does not exist.
 *
 * @param path - The directory path to check
 * @returns An indicator specifying if the directory exists
 */
export async function createDirectory(path: string) {
  if (await exists(path)) {
    return;
  }

  return mkdir(path, { recursive: true });
}

/**
 * Remove a directory if it exists.
 *
 * @param path - The directory path to check
 * @returns An indicator specifying if the directory exists
 */
export function removeDirectorySync(path: string) {
  if (!existsSync(path)) {
    return;
  }

  return rmdirSync(path, { recursive: true });
}

/**
 * Remove a directory if it exists.
 *
 * @param path - The directory path to check
 * @returns An indicator specifying if the directory exists
 */
export async function removeDirectory(path: string) {
  if (!existsSync(path)) {
    return;
  }

  return rmdir(path, { recursive: true });
}

/**
 * Extracts a file from a given tarball to the specified destination.
 *
 * @param tarballPath - The path to the tarball from where the file should be extracted.
 * @param file - The path to the file inside the tarball.
 * @param destinationFilePath - The destination file path.
 * @returns True if the file was extracted successfully, false otherwise.
 */
export async function extractFileFromTar(
  tarballPath: string,
  file: string,
  destinationFilePath: string
) {
  const result = parseTar(await readFile(tarballPath));

  const entry = result.find(e => e.name === file);
  if (!entry?.data) {
    return;
  }

  if (!(await exists(destinationFilePath))) {
    await mkdir(destinationFilePath, { recursive: true });
  }

  const stream = createWriteStream(destinationFilePath);
  stream.write(entry.data);
}

/**
 * Extracts a file from a given TarGzip to the specified destination.
 *
 * @param tarballPath - The path to the tarball from where the file should be extracted.
 * @param file - The path to the file inside the tarball.
 * @param destinationFilePath - The destination file path.
 * @returns True if the file was extracted successfully, false otherwise.
 */
export async function extractFileFromTarGzip(
  tarballPath: string,
  file: string,
  destinationFilePath: string
) {
  const result = await parseTarGzip(await readFile(tarballPath));

  const entry = result.find(e => e.name === file);
  if (!entry?.data) {
    return;
  }

  if (!(await exists(destinationFilePath))) {
    await mkdir(destinationFilePath, { recursive: true });
  }

  const stream = createWriteStream(destinationFilePath);
  stream.write(entry.data);
}
