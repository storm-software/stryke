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

import { AbortError } from "./errors";

interface DelayOptions {
  signal?: AbortSignal;
}

/**
 * Delays the execution of code for a specified number of milliseconds.
 *
 * This function returns a Promise that resolves after the specified delay, allowing you to use it
 * with async/await to pause execution.
 *
 * @example
 * ```typescript
 * async function foo() {
 *   console.log('Start');
 *   await delay(1000); // Delays execution for 1 second
 *   console.log('End');
 * }
 *
 * foo();
 *
 * // With AbortSignal
 * const controller = new AbortController();
 * const { signal } = controller;
 *
 * setTimeout(() => controller.abort(), 50); // Will cancel the delay after 50ms
 * try {
 *   await delay(100, { signal });
 *  } catch (error) {
 *   console.error(error); // Will log 'AbortError'
 *  }
 * }
 * ```
 *
 * @param ms - The number of milliseconds to delay.
 * @param options - The options object.
 * @returns A Promise that resolves after the specified delay.
 */
export async function delay(
  ms: number,
  { signal }: DelayOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const abortError = () => {
      reject(new AbortError());
    };

    const abortHandler = () => {
      // eslint-disable-next-line ts/no-use-before-define
      clearTimeout(timeoutId);
      abortError();
    };

    if (signal?.aborted) {
      // eslint-disable-next-line no-promise-executor-return
      return abortError();
    }

    const timeoutId = setTimeout(resolve, ms);

    signal?.addEventListener("abort", abortHandler, { once: true });
  });
}

/**
 * Delays the execution of code for a specified number of milliseconds.
 *
 * This function returns a Promise that resolves after the specified delay, allowing you to use it
 * with async/await to pause execution.
 *
 * @example
 * ```typescript
 * async function foo() {
 *   console.log('Start');
 *   await sleep(1000); // Delays execution for 1 second
 *   console.log('End');
 * }
 *
 * foo();
 *
 * // With AbortSignal
 * const controller = new AbortController();
 * const { signal } = controller;
 *
 * setTimeout(() => controller.abort(), 50); // Will cancel the delay after 50ms
 * try {
 *   await sleep(100, { signal });
 *  } catch (error) {
 *   console.error(error); // Will log 'AbortError'
 *  }
 * }
 * ```
 *
 * @param ms - The number of milliseconds to sleep.
 * @param options - The options object.
 * @returns A Promise that resolves after the specified sleep.
 */
export async function sleep(ms: number, options?: DelayOptions): Promise<void> {
  return delay(ms, options);
}
