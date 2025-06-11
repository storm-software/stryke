/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

export function isTypedArray(
  obj: any
): obj is
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | BigUint64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array
  | Float32Array
  | Float64Array {
  return (
    obj instanceof Uint8Array ||
    obj instanceof Uint8ClampedArray ||
    obj instanceof Uint16Array ||
    obj instanceof Uint32Array ||
    obj instanceof BigUint64Array ||
    obj instanceof Int8Array ||
    obj instanceof Int16Array ||
    obj instanceof Int32Array ||
    obj instanceof BigInt64Array ||
    obj instanceof Float32Array ||
    obj instanceof Float64Array
  );
}
