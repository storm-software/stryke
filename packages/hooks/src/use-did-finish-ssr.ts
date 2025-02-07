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

import { isFunction } from "@stryke/types/type-checks/is-function";
import { useEffect, useState, useSyncExternalStore } from "react";

/* eslint-disable react-hooks/rules-of-hooks */

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

  return done ? (isFunction(value) ? value() : value) : undefined;
}
