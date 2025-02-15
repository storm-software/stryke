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

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @param arrayBuffer - The array buffer to clone.
 * @returns Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer: ArrayBufferLike): ArrayBuffer {
  const result = new ArrayBuffer(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @param dataView - The data view to clone.
 * @returns Returns the cloned data view.
 */
function cloneDataView(dataView: DataView): DataView {
  const buffer = cloneArrayBuffer(dataView.buffer);

  return new DataView(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `date`.
 *
 * @param targetDate - The date to clone.
 * @returns Returns the cloned date.
 */
function cloneDate(targetDate: Date): Date {
  return new Date(targetDate.getTime());
}

/**
 * Creates a clone of `regExp`.
 *
 * @param targetMap - The regular expression to clone.
 * @returns Returns the cloned regular expression.
 */
function cloneMap<K, V>(targetMap: Map<K, V>): Map<K, V> {
  const map = new Map<K, V>();
  for (const [key, value] of targetMap.entries()) {
    map.set(deepCopy(key), deepCopy(value));
  }

  return map;
}

type TypedArrayType =
  | Float32Array
  | Float64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Uint8ClampedArray
  | BigInt64Array
  | BigUint64Array;

type TypedArrayConstructorType =
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | Int8ArrayConstructor
  | Int16ArrayConstructor
  | Int32ArrayConstructor
  | Uint8ArrayConstructor
  | Uint16ArrayConstructor
  | Uint32ArrayConstructor
  | Uint8ClampedArrayConstructor
  | BigInt64ArrayConstructor
  | BigUint64ArrayConstructor;

const TypedArrayConstructorMap: Record<string, TypedArrayConstructorType> = {
  "[object Float32Array]": Float32Array,
  "[object Float64Array]": Float64Array,
  "[object Int8Array]": Int8Array,
  "[object Int16Array]": Int16Array,
  "[object Int32Array]": Int32Array,
  "[object Uint8Array]": Uint8Array,
  "[object Uint16Array]": Uint16Array,
  "[object Uint32Array]": Uint32Array,
  "[object Uint8ClampedArray]": Uint8ClampedArray
};

const TypedArrayMap: Record<string, Function> = {
  "[object Date]": cloneDate,
  "[object ArrayBuffer]": cloneArrayBuffer,
  "[object DataView]": cloneDataView,
  "[object Float32Array]": cloneTypedArray,
  "[object Float64Array]": cloneTypedArray,
  "[object Int8Array]": cloneTypedArray,
  "[object Int16Array]": cloneTypedArray,
  "[object Int32Array]": cloneTypedArray,
  "[object Uint8Array]": cloneTypedArray,
  "[object Uint8ClampedArray]": cloneTypedArray,
  "[object Uint16Array]": cloneTypedArray,
  "[object Uint32Array]": cloneTypedArray,
  "[object BigInt64Array]": cloneTypedArray,
  "[object BigUint64Array]": cloneTypedArray,
  "[object RegExp]": cloneRegExp,
  "[object Map]": cloneMap
};

/**
 * Creates a clone of `typedArray`.
 *
 * @param typedArray - The typed array to clone.
 * @returns Returns the cloned typed array.
 */
function cloneTypedArray(typedArray: TypedArrayType): TypedArrayType {
  try {
    TypedArrayConstructorMap["[object BigInt64Array]"] = BigInt64Array;
    TypedArrayConstructorMap["[object BigUint64Array]"] = BigUint64Array;
  } catch {
    // Do nothing
  }

  const buffer = cloneArrayBuffer(typedArray.buffer);

  const constructor =
    TypedArrayConstructorMap[Object.prototype.toString.call(typedArray)];
  if (!constructor) {
    throw new Error("Unsupported typed array type in `cloneTypedArray`.");
  }

  return new constructor(buffer).subarray(
    typedArray.byteOffset,
    typedArray.byteOffset + typedArray.length
  );
}

/**
 * Creates a clone of `regexp`.
 *
 * @param targetRegexp - The regexp to clone.
 * @returns Returns the cloned regexp.
 */
export function cloneRegExp(targetRegexp: RegExp): RegExp {
  const result = new RegExp(targetRegexp.source, targetRegexp.flags);
  result.lastIndex = targetRegexp.lastIndex;
  return result;
}

/**
 * Creates a deep copy of `target`.
 *
 * @see Original source: ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
 *
 * @remarks
 * **Use this method instead of {@link ./deep-clone#deepClone} if you want to deep copy a value and retain its type (not cloning into a plain object).**
 *
 * This method is a deep copy of the given value. It supports the following types:
 * - `ArrayBuffer`
 * - `DataView`
 * - `Date`
 * - `Map`
 * - `RegExp`
 * - `Set`
 * - `TypedArray`
 * - `WeakMap`
 * - `WeakSet`
 * - `Array`
 * - `Object`
 * - `null`
 * - `undefined`
 * - `string`
 * - `number`
 * - `boolean`
 * - `symbol`
 * - `bigint`
 * - `function`
 * - `Error`
 * - `Promise`
 * - `MapIterator`
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } };
 * const copy = deepCopy(original);
 * console.log(copy); // { a: 1, b: { c: 2 } }
 * console.log(copy !== original); // true
 * console.log(copy.b !== original.b); // true
 *
 * const date = new Date();
 * const dateCopy = deepCopy(date);
 * console.log(dateCopy); // Same date value as `date`
 * console.log(dateCopy !== date); // true
 *
 * const map = new Map([['key', 'value']]);
 * const mapCopy = deepCopy(map);
 * console.log(mapCopy.get('key')); // 'value'
 * console.log(mapCopy !== map); // true
 *
 * const arrayBuffer = new ArrayBuffer(8);
 * const arrayBufferCopy = deepCopy(arrayBuffer);
 * console.log(arrayBufferCopy.byteLength); // 8
 * console.log(arrayBufferCopy !== arrayBuffer); // true
 * ```
 *
 * @param T - Generic type of target/copied value.
 * @param target - Target value to be copied.
 * @returns Returns the copied value.
 */
export function deepCopy<T>(target: T): T {
  const tag = Object.prototype.toString.call(target);

  if (TypedArrayMap[tag]) {
    return TypedArrayMap[tag](target);
  }
  if (target === null) {
    return target;
  }
  if (Array.isArray(target)) {
    const cp = [] as any[];
    for (const v of target as any[]) {
      cp.push(v);
    }
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof target === "object") {
    const cp = { ...(target as { [key: string]: any }) } as {
      [key: string]: any;
    };
    for (const k of Object.keys(cp)) {
      cp[k] = deepCopy<any>(cp[k]);
    }
    return cp as T;
  }
  return target;
}
