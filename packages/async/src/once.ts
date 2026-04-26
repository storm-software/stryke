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

/** silence "error TS2322" but practically this is safer and more convenient than resorting to `any` in a random place */
export function safeFunctionCast<TFunc extends (...args: any[]) => any>(
  fn: (...args: Parameters<TFunc>) => ReturnType<TFunc>
): TFunc {
  // @ts-expect-error
  //   error TS2322: Type '(...args: Parameters<F>) => ReturnType<F>' is not assignable to type 'F'.
  //   '(...args: Parameters<F>) => ReturnType<F>' is assignable to the constraint of type 'F', but 'F' could be instantiated with a different subtype of constraint '(...args: any[]) => any'.
  return fn;
}

/**
 * Executes a function only once.
 *
 * @param fn - The function to be executed only once.
 * @returns A function that, when called, will execute the original function only once.
 */
export function once<TFunc extends (...args: any[]) => any>(fn: TFunc): TFunc {
  let result: ReturnType<TFunc>;
  let called = false;

  // eslint-disable-next-line func-names
  return safeFunctionCast<TFunc>(function (this: unknown, ...args) {
    if (!called) {
      result = fn.apply(this, args);
      called = true;
    }
    return result;
  });
}
