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

function recursiveCopy(
  value: unknown,
  clone: unknown,
  references: WeakMap<Record<string, unknown>, unknown>,
  visited: WeakSet<Record<string, unknown>>,
  customizer: Parameters<typeof copy>[2]
): unknown {
  const valueType = detectType(value);
  const copiedValue = copy(value, valueType);

  // return if not a collection value
  if (!isCollection(valueType)) {
    return copiedValue;
  }

  const keys = /* #__INLINE__ */ getKeys(value as Collection, valueType);

  // walk within collection with iterator
  for (const collectionKey of keys) {
    const collectionValue = /* #__INLINE__ */ getValue(
      value as Collection,
      collectionKey,
      valueType
    ) as Record<string, unknown>;

    if (visited.has(collectionValue)) {
      // for [Circular]
      setValue(
        clone as Collection,
        collectionKey,
        references.get(collectionValue),
        valueType
      );
    } else {
      const collectionValueType = detectType(collectionValue);
      const copiedCollectionValue = copy(collectionValue, collectionValueType);

      // save reference if value is collection
      if (isCollection(collectionValueType)) {
        references.set(collectionValue, copiedCollectionValue);
        visited.add(collectionValue);
      }

      setValue(
        clone as Collection,
        collectionKey,
        recursiveCopy(
          collectionValue,
          copiedCollectionValue,
          references,
          visited,
          customizer
        ),
        valueType
      );
    }
  }

  // TODO: isSealed/isFrozen/isExtensible

  return clone;
}

export type Options = { customizer?: Customizer };

/**
 * Deep copy value
 *
 * @param value - The value to copy.
 * @param options - The options object.
 * @returns Returns the copied value.
 */
export function deepCopy<T extends Record<string, any>>(
  value: T,
  options?: Options
): T {
  const {
    // TODO: before/after customizer
    customizer = null
    // TODO: max depth
    // depth = Infinity,
  } = options ?? {};

  const valueType = detectType(value);

  if (!isCollection(valueType)) {
    return copy(value, valueType, customizer) as T;
  }

  const copiedValue = copy(value, valueType, customizer);
  const references = new WeakMap<Record<string, any>, unknown>([
    [value as Record<string, any>, copiedValue]
  ]);

  const visited = new WeakSet<Record<string, any>>([value]);

  return recursiveCopy(
    value,
    copiedValue,
    references,
    visited,
    customizer
  ) as T;
}
