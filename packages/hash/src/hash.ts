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

import type { HashObjectOptions } from "./hash-object";
import { statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { joinPaths } from "@stryke/path/join-path";
import { isString } from "@stryke/types/type-checks/is-string";
import { hashObject } from "./hash-object";
import { sha256base64 } from "./sha-256";

export interface HashOptions extends HashObjectOptions {
  /**
   * The maximum length of the hash
   *
   * @defaultValue 32
   */
  maxLength?: number;
}

/**
 * Hash any JS value into a string
 *
 * @param object - The value to hash
 * @param  options - Hashing options
 * @returns A hashed string value
 */
export function hash(object: any, options?: HashOptions): string {
  const result = sha256base64(
    isString(object) ? object : hashObject(object, options)
  );
  const maxLength = options?.maxLength ?? 32;

  return result.length > maxLength ? result.slice(0, maxLength) : result;
}

/**
 * Hash a folder path into a string based on the file content
 *
 * @param dir - The folder path to hash
 * @param  options - Hashing options
 * @returns A hashed string value
 */
export async function hashFolder(
  dir: string,
  options?: HashOptions
): Promise<string> {
  const files = [] as string[];
  const getDirContent = async (dir: string) => {
    const dirFiles = await readdir(dir);
    dirFiles.forEach(file => {
      const path = joinPaths(dir, file);
      if (statSync(path).isDirectory()) {
        getDirContent(path);
      } else {
        files.push(path);
      }
    });
  };
  await getDirContent(dir);

  const result = {} as Record<string, string>;
  await Promise.all(
    files.map(async file => {
      result[file] = await readFile(file, "utf8");
    })
  );

  return hash(result, options);
}
