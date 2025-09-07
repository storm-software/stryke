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
 * FNV-1a Hash implementation
 *
 * Ported from https://github.com/tjwebb/fnv-plus/blob/master/index.js
 *
 * @remarks
 * Simplified, optimized and add modified for 52 bit, which provides a larger hash space
 * and still making use of Javascript's 53-bit integer space.
 */
export const fnv1a52 = (str: string) => {
  const len = str.length;
  let i = 0;
  let t0 = 0;
  let v0 = 0x2325;
  let t1 = 0;
  let v1 = 0x8422;
  let t2 = 0;
  let v2 = 0x9ce4;
  let t3 = 0;
  let v3 = 0xcbf2;

  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = (t3 + (t2 >>> 16)) & 65535;
    v2 = t2 & 65535;
  }

  return (
    (v3 & 15) * 281474976710656 +
    v2 * 4294967296 +
    v1 * 65536 +
    (v0 ^ (v3 >> 4))
  );
};

/**
 * Generates an ETag for the given payload.
 *
 * @param payload - The payload to generate an ETag for.
 * @param weak - Whether to generate a weak ETag.
 * @returns The generated ETag.
 */
export const generateETag = (payload: string, weak = false) => {
  const prefix = weak ? 'W/"' : '"';

  return `${prefix + fnv1a52(payload).toString(36) + payload.length.toString(36)}"`;
};
