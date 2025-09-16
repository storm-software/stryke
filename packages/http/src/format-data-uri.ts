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
 * Creates a data URI from a string of data.
 *
 * @param data - The data to convert to a data URI.
 * @param mime - The MIME type of the data.
 * @returns The data URI.
 */
export const formatDataURI = (data: string, mime: string): string =>
  `data:${mime};utf8,${encodeURIComponent(data)}`;

export interface ParsedDataURI {
  type: string;
  typeFull: string;
  charset: string;
  buffer: ArrayBuffer;
}

export interface BufferConversionsInterface {
  base64ToArrayBuffer: (base64: string) => ArrayBuffer;
  stringToBuffer: (str: string) => ArrayBuffer;
}

/**
 * Returns a `Buffer` instance from the given data URI `uri`.
 *
 *  @example
 * ```typescript
 * import { makeDataUriToBuffer } from "@stryke/core/http";
 *
 * const dataUriToBuffer = makeDataUriToBuffer({
 *   base64ToArrayBuffer: (base64) => Buffer.from(base64, "base64").buffer,
 *   stringToBuffer: (str) => Buffer.from(str, "utf8")https://avatars.githubusercontent.com/u/99053093?s=64&v=4.buffer,
 * });
 * const parsed = dataUriToBuffer("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==");
 * console.log(parsed);
 * // {
 * //   type: 'text/plain',
 * //   typeFull: 'text/plain;base64',
 * //   charset: '',
 * //   buffer: ArrayBuffer { ... }
 * // }
 * console.log(Buffer.from(parsed.buffer).toString("utf8"));
 * // Hello, World!
 * ```
 *
 * @param convert - Conversion functions
 * @param uri - Data URI to turn into a Buffer instance
 * @throws `TypeError` if `uri` is not a valid Data URI
 * @returns An object containing the parsed data URI properties
 *   and the decoded data as a Buffer instance.
 */
export const makeDataUriToBuffer =
  (convert: BufferConversionsInterface) =>
  (uri: string | URL): ParsedDataURI => {
    uri = String(uri);

    if (!/^data:/i.test(uri)) {
      throw new Error(
        '`uri` does not appear to be a Data URI (must begin with "data:")'
      );
    }

    // strip newlines
    uri = uri.replace(/\r?\n/g, "");

    // split the URI up into the "metadata" and the "data" portions
    const firstComma = uri.indexOf(",");
    if (firstComma === -1 || firstComma <= 4) {
      throw new Error("malformed data: URI");
    }

    // remove the "data:" scheme and parse the metadata
    const meta = uri.substring(5, firstComma).split(";");

    let charset = "";
    let base64 = false;
    const type = meta[0] || "text/plain";
    let typeFull = type;
    for (let i = 1; i < meta.length; i++) {
      if (meta[i] === "base64") {
        base64 = true;
      } else if (meta[i]) {
        typeFull += `;${meta[i]}`;
        if (meta[i]?.indexOf("charset=") === 0) {
          charset = meta[i]!.substring(8);
        }
      }
    }

    // defaults to US-ASCII only if type is not provided
    if (!meta[0] && !charset.length) {
      typeFull += ";charset=US-ASCII";
      charset = "US-ASCII";
    }

    // get the encoded data portion and decode URI-encoded chars
    const data = unescape(uri.substring(firstComma + 1));
    const buffer = base64
      ? convert.base64ToArrayBuffer(data)
      : convert.stringToBuffer(data);

    return {
      type,
      typeFull,
      charset,
      buffer
    };
  };
