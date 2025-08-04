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
import { useEffect, useState, useSyncExternalStore } from "react";

const emptyFn = () => {};
const emptyFnFn = () => emptyFn;

export function useDidFinishSSR<A = boolean>(
  value?: A,
  options?: {
    sync?: boolean;
  }
): A | false {
  if (process.env.TAMAGUI_TARGET === "native") {
    return (value ?? true) as false | A;
  }

  if (options?.sync) {
    return useSyncExternalStore(
      emptyFnFn,
      () => value ?? true,
      () => false as any
    );
  }

  const [cur, setCur] = useState<any>(value);
  useEffect(() => {
    setCur(value ?? true);
  }, [value]);
  return cur ?? false;
}

export function useDidFinishSSRSync<A = boolean>(value?: A): A | false {
  return useDidFinishSSR(value, {
    sync: true
  });
}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value;

export function useClientValue<Value>(
  value?: Value
): FunctionOrValue<Value> | undefined {
  const done = useDidFinishSSR();

  return done
    ? isFunction(value)
      ? value()
      : (value as FunctionOrValue<Value>)
    : undefined;
}
