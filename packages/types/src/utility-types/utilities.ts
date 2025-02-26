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

import type { Primitive } from "./base";

export type Nullable<T> = T | null;
export type IsNullable<T> = [null] extends [T] ? true : false;

export type RequiredByKey<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type NoInfer<T> = [T][T extends any ? 0 : never];

type Narrowable = string | number | bigint | boolean;

type NarrowRaw<A> =
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | {
      [K in keyof A]: A[K] extends Function ? A[K] : NarrowRaw<A[K]>;
    };

export type Narrow<A> = Try<A, [], NarrowRaw<A>>;

export type Try<A1, A2, Catch = never> = A1 extends A2 ? A1 : Catch;

// Hack to get TypeScript to show simplified types in error messages
export type Pretty<T> = { [K in keyof T]: T[K] } & {};

export type ComputeRange<
  N extends number,
  Result extends unknown[] = []
> = Result["length"] extends N
  ? Result
  : ComputeRange<N, [...Result, Result["length"]]>;

export type Index40 = ComputeRange<40>[number];

/**
 * A utility type for specifying a name/value pair.
 */
export interface NameValuePair<TValue, TName = string> {
  /**
   * The name of the pair
   */
  name: TName;

  /**
   * The value of the pair
   */
  value: TValue;
}

/**
 * Ask TS to re-check that `A1` extends `A2`.
 * And if it fails, `A2` will be enforced anyway.
 * Can also be used to add constraints on parameters.
 *
 * @example
 * ```ts
 * import { Cast } from '@stryke/types'
 *
 * type test0 = Cast<'42', string> // '42'
 * type test1 = Cast<'42', number> // number
 * ```
 *
 * @param A1 - to check against
 * @param A2 - to cast to
 * @returns `A1 | A2`
 */
export type Cast<A1 extends any, A2 extends any> = A1 extends A2 ? A1 : A2;

// type Primitive = undefined | null | boolean | string | number;

export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? DeepReadonlyArray<U>
    : DeepReadonlyObject<T>;

export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

export type DeepReadonlyObject<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
};
