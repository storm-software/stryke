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

// Based on https://github.com/brix/crypto-js 4.1.1 (MIT)

import { Base64, Hasher, WordArray } from "./hasher";

// Initialization and round constants tables
const H = [
  1_779_033_703, -1_150_833_019, 1_013_904_242, -1_521_486_534, 1_359_893_119,
  -1_694_144_372, 528_734_635, 1_541_459_225
];
const K = [
  1_116_352_408, 1_899_447_441, -1_245_643_825, -373_957_723, 961_987_163,
  1_508_970_993, -1_841_331_548, -1_424_204_075, -670_586_216, 310_598_401,
  607_225_278, 1_426_881_987, 1_925_078_388, -2_132_889_090, -1_680_079_193,
  -1_046_744_716, -459_576_895, -272_742_522, 264_347_078, 604_807_628,
  770_255_983, 1_249_150_122, 1_555_081_692, 1_996_064_986, -1_740_746_414,
  -1_473_132_947, -1_341_970_488, -1_084_653_625, -958_395_405, -710_438_585,
  113_926_993, 338_241_895, 666_307_205, 773_529_912, 1_294_757_372,
  1_396_182_291, 1_695_183_700, 1_986_661_051, -2_117_940_946, -1_838_011_259,
  -1_564_481_375, -1_474_664_885, -1_035_236_496, -949_202_525, -778_901_479,
  -694_614_492, -200_395_387, 275_423_344, 430_227_734, 506_948_616,
  659_060_556, 883_997_877, 958_139_571, 1_322_822_218, 1_537_002_063,
  1_747_873_779, 1_955_562_222, 2_024_104_815, -2_067_236_844, -1_933_114_872,
  -1_866_530_822, -1_538_233_109, -1_090_935_817, -965_641_998
];

// Reusable object
const W: number[] = [];

/**
 * SHA-256 hash algorithm.
 */
export class SHA256 extends Hasher {
  _hash = new WordArray([...H]);

  /**
   * Resets the internal state of the hash object to initial values.
   */
  override reset() {
    super.reset();
    this._hash = new WordArray([...H]);
  }

  override _doProcessBlock(M: number[], offset: number) {
    // Shortcut
    const H = this._hash.words;

    // Working variables
    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    let f = H[5];
    let g = H[6];
    let h = H[7];

    // Computation
    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        W[i] = Math.trunc(M[offset + i]!);
      } else {
        const gamma0x = W[i - 15];
        const gamma0 =
          ((gamma0x! << 25) | (gamma0x! >>> 7)) ^
          ((gamma0x! << 14) | (gamma0x! >>> 18)) ^
          (gamma0x! >>> 3);

        const gamma1x = W[i - 2];
        const gamma1 =
          ((gamma1x! << 15) | (gamma1x! >>> 17)) ^
          ((gamma1x! << 13) | (gamma1x! >>> 19)) ^
          (gamma1x! >>> 10);

        W[i] = gamma0 + W[i - 7]! + gamma1 + W[i - 16]!;
      }

      const ch = (e! & f!) ^ (~e! & g!);
      const maj = (a! & b!) ^ (a! & c!) ^ (b! & c!);

      const sigma0 =
        ((a! << 30) | (a! >>> 2)) ^
        ((a! << 19) | (a! >>> 13)) ^
        ((a! << 10) | (a! >>> 22));
      const sigma1 =
        ((e! << 26) | (e! >>> 6)) ^
        ((e! << 21) | (e! >>> 11)) ^
        ((e! << 7) | (e! >>> 25));

      const t1 = h! + sigma1 + ch + K[i]! + W[i]!;
      const t2 = sigma0 + maj;

      h = g;
      g = f;
      f = e;
      e = Math.trunc(d! + t1);
      d = c;
      c = b;
      b = a;
      a = Math.trunc(t1 + t2);
    }

    // Intermediate hash value
    H[0] = Math.trunc(H[0]! + a!);
    H[1] = Math.trunc(H[1]! + b!);
    H[2] = Math.trunc(H[2]! + c!);
    H[3] = Math.trunc(H[3]! + d!);
    H[4] = Math.trunc(H[4]! + e!);
    H[5] = Math.trunc(H[5]! + f!);
    H[6] = Math.trunc(H[6]! + g!);
    H[7] = Math.trunc(H[7]! + h!);
  }

  /**
   * Finishes the hash calculation and returns the hash as a WordArray.
   *
   * @param messageUpdate - Additional message content to include in the hash.
   * @returns The finalized hash as a WordArray.
   */
  override finalize(messageUpdate: string): WordArray {
    super.finalize(messageUpdate);

    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = this._data.sigBytes * 8;

    // Add padding
    this._data.words[nBitsLeft >>> 5]! |= 0x80 << (24 - (nBitsLeft % 32));
    this._data.words[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
      nBitsTotal / 0x1_00_00_00_00
    );
    this._data.words[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
    this._data.sigBytes = this._data.words.length * 4;

    // Hash final blocks
    this._process();

    // Return final computed hash
    return this._hash;
  }
}

/**
 * Calculates the SHA-256 hash of the message provided.
 *
 * @param message - The message to hash.
 * @returns The message hash as a hexadecimal string.
 */
export function sha256(message: string) {
  return new SHA256().finalize(message).toString();
}

/**
 * Calculates the SHA-256 hash of the given message and encodes it in Base64.
 *
 * @param message - The message to hash.
 * @returns The base64 encoded hash of the message.
 */
export function sha256base64(message: string) {
  return new SHA256().finalize(message).toString(Base64);
}
