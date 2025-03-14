/* -------------------------------------------------------------------

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

 ------------------------------------------------------------------- */

/**
 * A no op, or no-op, function for no operation
 *
 * @remarks Please see {@link https://dev.to/praneshpsg239/noop-in-javascript-478h | this article} for more information.
 *
 * @param _params - An optional parameter passed to the function. It can be anything (but is not used in any way)
 */
export const noop = (_params?: unknown): void => {};

/**
 * An asynchronous no-operation function that does nothing.
 * This can be used as a placeholder or default function.
 *
 * @example
 * asyncNoop(); // Does nothing
 *
 * @returns This function returns a Promise that resolves to undefined.
 */
export async function asyncNoop(_params?: unknown): Promise<void> {}
