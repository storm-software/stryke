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

/**
 * Check if the provided value's type is `boolean`
 *
 * @param value - The value to type check
 * @returns An indicator specifying if the value provided is of type `boolean`
 */
export const isBoolean = (value: unknown): value is boolean => {
  try {
    return (
      value instanceof Boolean ||
      typeof value === "boolean" ||
      Boolean(value) === value
    );
  } catch {
    return false;
  }
};
