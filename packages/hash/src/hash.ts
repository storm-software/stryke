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

import { isString } from "@stryke/type-checks/is-string";
import type { HashObjectOptions } from "./hash-object";
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
