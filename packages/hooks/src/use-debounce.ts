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

import { debounce, DebounceOptions } from "@stryke/helpers/debounce";
import { useEffect, useMemo, useRef, useState } from "react";

// export function debounce<A extends Function>(
//   func: A,
//   wait?: number,
//   leading?: boolean
// ): A & {
//   cancel: () => void;
// } {
//   let timeout: any;
//   let isCancelled = false;

//   function debounced(this: any) {
//     isCancelled = false;
//     const args = arguments;
//     if (leading && !timeout) {
//       func.apply(this, args);
//     }
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       timeout = null;
//       if (!(leading || isCancelled)) {
//         func.apply(this, args);
//       }
//       isCancelled = false;
//     }, wait);
//   }

//   debounced.cancel = () => {
//     isCancelled = true;
//   };

//   return debounced as any;
// }

export function useDebounce<
  A extends (...args: any) => any | undefined | null,
  DebouncedFn extends A & {
    cancel: () => void;
  },
>(
  fn: A,
  wait: number,
  options: DebounceOptions = {},
  mountArgs: any[] = [fn, options, wait],
): DebouncedFn {
  const dbEffect = useRef<DebouncedFn | null>(null);

  useEffect(() => {
    return () => {
      dbEffect.current?.cancel();
    };
  }, []);

  return useMemo(() => {
    dbEffect.current = debounce(fn, wait, options) as unknown as DebouncedFn;
    return dbEffect.current;
  }, [fn, options, wait]);
}

/**
 * Returns a value once it stops changing after "amt" time.
 * Note: you may need to memo or this will keep re-rendering
 */
export function useDebounceValue<A>(val: A, amt = 0): A {
  const [state, setState] = useState(val);

  useEffect(() => {
    const tm = setTimeout(() => {
      setState((prev) => {
        if (prev === val) return prev;
        return val;
      });
    }, amt);

    return () => {
      clearTimeout(tm);
    };
  }, [amt, val]);

  return state;
}
