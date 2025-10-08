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
import { isMergeableObject } from "@stryke/type-checks/is-mergeable-object";
import { propertyUnsafe } from "@stryke/type-checks/property-exists";

const emptyTarget = (val: any) => {
  return Array.isArray(val) ? [] : {};
};

const cloneUnlessOtherwiseSpecified = (
  value: any,
  options: {
    clone?: boolean;
    isMergeableObject: (value: any) => boolean;
  }
) => {
  return options.clone !== false && options.isMergeableObject(value)
    ? deepMerge(emptyTarget(value), value, options)
    : value;
};

const defaultArrayMerge = (target: any[], source: any[], options?: any) => {
  return [...target, ...source].map(element => {
    return cloneUnlessOtherwiseSpecified(element, options);
  });
};

const getMergeFunction = (
  key: string,
  options: {
    customMerge?: (key: string) => any;
  }
) => {
  if (!options.customMerge) {
    return deepMerge;
  }
  const customMerge = options.customMerge(key);

  return isFunction(customMerge) ? customMerge : deepMerge;
};

const getKeys = (target: Record<string, any>) => {
  return [
    ...Object.keys(target),
    ...((Object.getOwnPropertySymbols
      ? Object.getOwnPropertySymbols(target).filter(symbol => {
          return Object.propertyIsEnumerable.call(target, symbol);
        })
      : []) as unknown as string[])
  ];
};

const mergeObject = (
  target: Record<string, any>,
  source: Record<string, any>,
  options: {
    clone?: boolean;
    customMerge?: (key: string) => any;
    isMergeableObject: (value: any) => boolean;
    cloneUnlessOtherwiseSpecified?: (
      value: any,
      options: {
        clone: boolean;
        isMergeableObject: (value: any) => boolean;
      }
    ) => any;
  }
) => {
  const destination: Record<string, any> = {};
  if (options.isMergeableObject(target)) {
    for (const key of getKeys(target)) {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    }
  }
  for (const key of getKeys(source)) {
    destination[key] =
      propertyUnsafe(target, key) && options.isMergeableObject(source[key])
        ? getMergeFunction(key, options)(target[key], source[key], options)
        : cloneUnlessOtherwiseSpecified(source[key], options);
  }
  return destination;
};

export interface DeepMergeOptions {
  clone?: boolean;
  customMerge?: (key: string) => any;
  isMergeableObject: (value: any) => boolean;
  cloneUnlessOtherwiseSpecified: (
    value: any,
    options: {
      clone?: boolean;
      isMergeableObject: (value: any) => boolean;
    }
  ) => any;
  arrayMerge: (target: any[], source: any[], options: any) => any;
}

/**
 * Deep merge two objects
 *
 * @param target - The target object
 * @param source - The source object
 * @param options - The options object
 * @returns The merged object
 */
export function deepMerge<X = any | any[], Y = any | any[], Z = X & Y>(
  target: X,
  source: Y,
  options?: Partial<DeepMergeOptions>
): Z {
  if (!target || !source) {
    return (target || source) as Z;
  }

  const opts = (options ?? {}) as DeepMergeOptions;
  opts.arrayMerge ??= defaultArrayMerge;
  opts.isMergeableObject ??= isMergeableObject;
  // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
  // implementations can use it. The caller may not replace it.
  opts.cloneUnlessOtherwiseSpecified ??= cloneUnlessOtherwiseSpecified;

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, opts);
  }
  if (sourceIsArray) {
    return opts.arrayMerge(target as any[], source, opts);
  }
  return mergeObject(target, source, opts) as Z;
}

deepMerge.all = function deepMergeAll(array: any[], options?: any) {
  if (!Array.isArray(array)) {
    throw new TypeError("first argument should be an array");
  }

  return array.reduce((prev, next) => {
    return deepMerge(prev, next, options);
  }, {});
};
