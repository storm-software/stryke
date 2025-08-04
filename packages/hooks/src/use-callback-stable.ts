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

import type { AnyFunction } from "@stryke/types/base";
import { useMemoStable } from "./use-memo-stable";

/**
 * Forked from use-memo-one by Alex Reardon
 */

/**
 * `useMemo` and `useCallback` cache the most recent result. However, this cache can be destroyed by React when it wants to.
 *
 * `useMemoStable` and `useCallbackStable` are concurrent mode safe alternatives to `useMemo` and `useCallback` that do provide semantic guarantee. What this means is that you will always get the same reference for a memoized value so long as there is no input change.
 *
 * Using `useMemoStable` and `useCallbackStable` will consume more memory than useMemo and `useCallback` in order to provide a stable cache. React can release the cache of `useMemo` and `useCallback`, but `useMemoStable` will not release the cache until it is garbage collected.
 *
 * @remarks
 * You may rely on useMemo as a performance optimization, not as a semantic guarantee. In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance.
 *
 * @param callback - The callback function to memoize
 * @param inputs - The inputs to watch for changes
 * @returns The memoized callback function
 */
export function useCallbackStable<TCallback extends AnyFunction = AnyFunction>(
  callback: TCallback,
  inputs?: any[]
): TCallback {
  return useMemoStable(() => callback, inputs);
}
