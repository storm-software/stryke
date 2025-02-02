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

/**
 * The function checks if the code is running on the server-side
 *
 * @returns An indicator specifying if the code is running on the server-side
 */
export const isRuntimeServer = (): boolean =>
  typeof globalThis === "undefined" || "Deno" in globalThis;

/**
 * The function checks if the code is running in
 * the browser (and not on the server).
 */
export const isRuntimeClient = (): boolean => !isRuntimeServer();
