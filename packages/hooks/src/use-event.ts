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

import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

type AnyFunction = (...args: any[]) => any;

const defaultValue = () => {
  throw new Error("Cannot call an event handler while rendering.");
};

/**
 * The function returns a memoized event handler.
 *
 * @param callback - The event handler to memoize.
 * @returns A memoized event handler.
 */
export function useEvent<T extends AnyFunction>(callback?: T): T {
  return useGet(callback, defaultValue, true) as T;
}

// keeps a reference to the current value easily
function useGet<A>(
  currentValue: A,
  initialValue?: any,
  forwardToFunction?: boolean
): () => A {
  const curRef = useRef<any>(initialValue ?? currentValue);
  useIsomorphicLayoutEffect(() => {
    curRef.current = currentValue;
  });

  return useCallback(
    forwardToFunction
      ? // eslint-disable-next-line ts/no-unsafe-call
        (...args) => curRef.current?.apply(null, args)
      : () => curRef.current,
    []
  );
}
