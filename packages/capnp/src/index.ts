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
 * The capnp library used by Storm Software for building NodeJS applications.
 *
 * @remarks
 * A package for running the Cap&#39;n Proto compiler in a TypeScript application
 *
 * @packageDocumentation
 */

export * from "./compile.js";
export * from "./types.js";

// Export all types and functions from capnp-es
export * from "capnp-es";
