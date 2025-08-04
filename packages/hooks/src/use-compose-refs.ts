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

import { isFunction } from "@stryke/type-checks/is-function";
import type { Ref, RefObject } from "react";
import { useCallback } from "react";

// from radix
// https://raw.githubusercontent.com/radix-ui/primitives/main/packages/react/compose-refs/src/composeRefs.tsx

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 *
 * @param ref - The ref to set
 * @param value - The value to set the ref to
 */
export function setRef<T>(ref: Ref<T> | undefined, value: T) {
  if (ref) {
    if (isFunction(ref)) {
      ref(value);
    } else {
      (ref as RefObject<T>).current = value;
    }
  }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 *
 * @param refs - The refs to compose
 * @returns A function that sets all refs to a given value
 */
export function composeRefs<T>(...refs: Ref<T>[]) {
  return (node: T) => {
    for (const ref of refs) {
      setRef(ref, node);
    }
  };
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 *
 * @param refs - The refs to compose
 * @returns A function that sets all refs to a given value
 */
export function useComposedRefs<T>(...refs: Ref<T>[]) {
  return useCallback(composeRefs(...refs), refs);
}
