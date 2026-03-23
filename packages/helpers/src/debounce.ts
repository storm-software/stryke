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

export interface DebounceOptions {
  signal?: AbortSignal;
}

/**
 * Creates a debounced function that delays invoking the provided function until after `debounceMs` milliseconds
 * have elapsed since the last time the debounced function was invoked. The debounced function also has a `cancel`
 * method to cancel any pending execution.
 *
 * @example
 * ```typescript
 * const debouncedFunction = debounce(() => {
 *   console.log('Function executed');
 * }, 1000);
 *
 * // Will log 'Function executed' after 1 second if not called again in that time
 * debouncedFunction();
 *
 * // Will not log anything as the previous call is canceled
 * debouncedFunction.cancel();
 *
 * // With AbortSignal
 * const controller = new AbortController();
 * const signal = controller.signal;
 * const debouncedWithSignal = debounce(() => {
 *  console.log('Function executed');
 * }, 1000, { signal });
 *
 * debouncedWithSignal();
 *
 * // Will cancel the debounced function call
 * controller.abort();
 * ```
 *
 * @param func - The function to debounce
 * @param debounceMs - The number of milliseconds to delay
 * @param options - Optional configuration for the debounced function, including an AbortSignal to cancel the debounce
 * @returns A new debounced function with a `cancel` method.
 */
export function debounce<F extends (...args: any[]) => void>(
  func: F,
  debounceMs: number,
  options: DebounceOptions = {}
): F & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const { signal } = options;

  const debounced = ((...args: Parameters<F>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    if (signal?.aborted) {
      return;
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, debounceMs);
  }) as F & { cancel: () => void };

  const onAbort = () => {
    debounced.cancel();
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  signal?.addEventListener("abort", onAbort, { once: true });

  return debounced;
}
