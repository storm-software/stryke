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

/// <reference types="node" />

/**
 * Compression formats supported for decompressing TAR files.
 * - `"gzip"`: Gzip compression format.
 * - `"none"`: No compression.
 */
type CompressionFormat = "gzip" | "none";

declare module "nanotar" {
  /**
   * Compression formats supported for decompressing TAR files.
   * - `"gzip"`: Gzip compression format.
   * - `"none"`: No compression.
   */
  type CompressionFormat = "gzip" | "none";

  function parseTarGzip(
    data: ArrayBuffer | Uint8Array,
    opts?: any & { compression?: CompressionFormat }
  ): Promise<any[]>;

  /**
   * Parses a TAR file from a binary buffer and returns an array of {@link TarFileItem} objects.
   *
   * @param data - The binary data of the TAR file.
   * @returns An array of file items contained in the TAR file.
   */
  function parseTar(data: ArrayBuffer | Uint8Array, opts?: any): any[];
}
