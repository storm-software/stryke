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

/**
 * Converts a JavaScript value to a canonical JSON string representation. This function is used for signing JSON objects in a consistent way, ensuring that the same input will always produce the same output string. The canonicalization process includes:
 * - Sorting object keys in lexicographical order.
 * - Removing whitespace and line breaks.
 * - Representing primitive values (null, boolean, number, string) in their standard JSON format.
 * - Recursively applying these rules to nested objects and arrays.
 *
 * This function is designed to produce a deterministic string representation of a JSON value, which is essential for cryptographic signing and verification processes where the exact byte representation of the data must be consistent across different environments and implementations.
 *
 * @param obj - The JavaScript value to convert to a canonical JSON string.
 * @returns A canonical JSON string representation of the input value.
 */
export function canonicalJson(obj: unknown): string {
  if (obj === null || obj === undefined) {
    return "null";
  }

  if (typeof obj === "boolean" || typeof obj === "number") {
    return JSON.stringify(obj);
  }

  if (typeof obj === "string") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    const items = obj.map(item => canonicalJson(item));

    return `[${items.join(",")}]`;
  }

  if (typeof obj === "object") {
    const keys = Object.keys(obj).sort();
    const pairs = keys.map(key => {
      const value = canonicalJson((obj as Record<string, unknown>)[key]);

      return `${JSON.stringify(key)}:${value}`;
    });

    return `{${pairs.join(",")}}`;
  }

  return "null";
}
