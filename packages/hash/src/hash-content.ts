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

import { canonicalJson } from "@stryke/json/canonical";
import { sha256 } from "./neutral";

/**
 * Hash the content of a PDU (Protocol Data Unit) by removing the `signatures` and `unsigned` fields, then hashing the remaining content using SHA-256 and encoding it as a base64url string. This function is useful for generating a consistent hash of the PDU content that can be used for integrity verification or caching purposes, while ignoring any fields that may change due to signatures or unsigned data.
 *
 * @param content - The PDU content to hash, represented as a record of string keys and unknown values.
 * @returns A promise that resolves to a base64url-encoded string representing the hash of the PDU content.
 */
export async function hashContent(
  content: Record<string, unknown>
): Promise<string> {
  // Remove signatures and unsigned before hashing
  const toHash = { ...content };
  delete toHash.signatures;
  delete toHash.unsigned;

  return sha256(canonicalJson(toHash));
}

/**
 * Verify the hash of a PDU (Protocol Data Unit) content by hashing the content using the {@link hashContent} function and comparing it to an expected hash value. This function is useful for validating the integrity of the PDU content by ensuring that the computed hash matches the expected hash, which can be used to detect any tampering or corruption of the content.
 *
 * @param content - The PDU content to verify, represented as a record of string keys and unknown values.
 * @param expectedHash - The expected hash value to compare against, represented as a string.
 * @returns A promise that resolves to a boolean indicating whether the computed hash of the content matches the expected hash value (true if they match, false otherwise).
 */
export async function verifyContent(
  content: Record<string, unknown>,
  expectedHash: string
): Promise<boolean> {
  const actualHash = await hashContent(content);

  return actualHash === expectedHash;
}
