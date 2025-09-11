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
 * Convert a Uint8Array to a ReadableStream
 *
 * @param data - The Uint8Array to convert
 * @returns The converted ReadableStream
 */
export function uint8ArrayToStream(
  data: Uint8Array
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    }
  });
}

/**
 * Concatenate an array of Uint8Array chunks into a single Uint8Array
 *
 * @param chunks - Array of Uint8Array chunks to concatenate
 * @returns The concatenated Uint8Array
 */
export function concatUint8Array(chunks: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const chunk of chunks) {
    total += chunk.length;
  }
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/**
 * Concatenate a ReadableStream of Uint8Array chunks into a single Uint8Array
 *
 * @param stream - The ReadableStream of Uint8Array chunks to concatenate
 * @returns A promise that resolves to the concatenated Uint8Array
 */
export async function concatUint8ArrayStream(
  stream: ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  await stream.pipeTo(
    new WritableStream({
      write(chunk) {
        chunks.push(chunk);
      }
    })
  );

  return concatUint8Array(chunks);
}
