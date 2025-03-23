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

import type { Arrayable } from "@stryke/types/array";
import type { Nullable } from "@stryke/types/utilities";

/**
 * Convert `Arrayable<T>` to `Array<T>`
 *
 * @param array - The `Arrayable<T>` to convert
 * @returns An `Array<T>` containing the elements of the input
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array ?? [];
  return Array.isArray(array) ? array : [array];
}
