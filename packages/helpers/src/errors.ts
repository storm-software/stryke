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
 * An error class representing an aborted operation.
 */
export class AbortError extends Error {
  constructor(message = "The operation was aborted") {
    super(message);
    this.name = "AbortError";
  }
}

/**
 * An error class representing an timeout operation.
 */
export class TimeoutError extends Error {
  constructor(message = "The operation was timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}
