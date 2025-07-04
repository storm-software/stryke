/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

// Based on https://github.com/brix/crypto-js 4.1.1 (MIT)

export class WordArray {
  words: number[];

  sigBytes: number;

  constructor(words?: number[], sigBytes?: number) {
    this.words = words ?? [];
    words = this.words;

    this.sigBytes = sigBytes ?? words.length * 4;
  }

  toString(encoder?: typeof Hex): string {
    // eslint-disable-next-line ts/no-use-before-define
    return (encoder ?? Hex).stringify(this);
  }

  concat(wordArray: WordArray) {
    // Clamp excess bits
    this.clamp();

    // Concat
    if (this.sigBytes % 4) {
      // Copy one byte at a time
      for (let i = 0; i < wordArray.sigBytes; i++) {
        const thatByte =
          (wordArray.words[i >>> 2]! >>> (24 - (i % 4) * 8)) & 0xff;
        this.words[(this.sigBytes + i) >>> 2]! |=
          thatByte << (24 - ((this.sigBytes + i) % 4) * 8);
      }
    } else {
      // Copy one word at a time
      for (let j = 0; j < wordArray.sigBytes; j += 4) {
        this.words[(this.sigBytes + j) >>> 2] = wordArray.words[j >>> 2]!;
      }
    }
    this.sigBytes += wordArray.sigBytes;

    // Chainable
    return this;
  }

  clamp() {
    // Clamp
    this.words[this.sigBytes >>> 2]! &=
      0xff_ff_ff_ff << (32 - (this.sigBytes % 4) * 8);
    this.words.length = Math.ceil(this.sigBytes / 4);
  }

  clone() {
    return new WordArray([...this.words]);
  }
}

export const Hex = {
  stringify(wordArray: WordArray) {
    // Convert
    const hexChars: string[] = [];
    for (let i = 0; i < wordArray.sigBytes; i++) {
      const bite = (wordArray.words[i >>> 2]! >>> (24 - (i % 4) * 8)) & 0xff;
      hexChars.push((bite >>> 4).toString(16), (bite & 0x0f).toString(16));
    }

    return hexChars.join("");
  }
};

export const Base64 = {
  stringify(wordArray: WordArray) {
    const keyStr =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const base64Chars: string[] = [];
    for (let i = 0; i < wordArray.sigBytes; i += 3) {
      const byte1 = (wordArray.words[i >>> 2]! >>> (24 - (i % 4) * 8)) & 0xff;
      const byte2 =
        (wordArray.words[(i + 1) >>> 2]! >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
      const byte3 =
        (wordArray.words[(i + 2) >>> 2]! >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

      const triplet = (byte1 << 16) | (byte2 << 8) | byte3;
      for (let j = 0; j < 4 && i * 8 + j * 6 < wordArray.sigBytes * 8; j++) {
        base64Chars.push(keyStr.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
      }
    }
    return base64Chars.join("");
  }
};

export const Latin1 = {
  parse(latin1Str: string) {
    // Shortcut
    const latin1StrLength = latin1Str.length;

    // Convert
    const words: number[] = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2]! |=
        (latin1Str.codePointAt(i)! & 0xff) << (24 - (i % 4) * 8);
    }

    return new WordArray(words, latin1StrLength);
  }
};

export const Utf8 = {
  parse(utf8Str: string) {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};

export class BufferedBlockAlgorithm {
  _data = new WordArray();

  _nDataBytes = 0;

  _minBufferSize = 0;

  blockSize = 512 / 32;

  reset() {
    this._data = new WordArray();
    this._nDataBytes = 0;
  }

  _append(data: string | WordArray) {
    // Convert string to WordArray, else assume WordArray already
    if (typeof data === "string") {
      data = Utf8.parse(data);
    }

    // Append

    this._data.concat(data);
    this._nDataBytes += data.sigBytes;
  }

  _doProcessBlock(_dataWords: any, _offset: any) {}

  _process(doFlush?: boolean) {
    let processedWords;

    // Count blocks ready
    const nBlocksReady = doFlush
      ? Math.ceil(this._data.sigBytes / (this.blockSize * 4))
      : Math.max(
          Math.trunc(this._data.sigBytes / (this.blockSize * 4)) -
            this._minBufferSize,
          0
        );

    // Count words ready
    const nWordsReady = nBlocksReady * this.blockSize;

    // Count bytes ready
    const nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);

    // Process blocks
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += this.blockSize) {
        // Perform concrete-algorithm logic
        this._doProcessBlock(this._data.words, offset);
      }

      // Remove processed words
      processedWords = this._data.words.splice(0, nWordsReady);
      this._data.sigBytes -= nBytesReady;
    }

    // Return processed words
    return new WordArray(processedWords, nBytesReady);
  }
}

export class Hasher extends BufferedBlockAlgorithm {
  update(messageUpdate: string) {
    // Append
    this._append(messageUpdate);

    // Update the hash
    this._process();

    // Chainable
    return this;
  }

  finalize(messageUpdate: string) {
    // Final message update
    if (messageUpdate) {
      this._append(messageUpdate);
    }
  }
}
