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

import typeDetect from "type-detect";

const isBufferExists = typeof Buffer !== "undefined";

const isBuffer: typeof Buffer.isBuffer = isBufferExists
  ? Buffer.isBuffer.bind(Buffer)
  : function isBuffer(
      obj: Parameters<typeof Buffer.isBuffer>[0]
    ): obj is Buffer {
      return false;
    };

const cloneBuffer: typeof Buffer.from = isBufferExists
  ? Buffer.from.bind(Buffer)
  : function cloneBuffer(value: unknown): any {
      return value;
    };

function clone(value: unknown, valueType: string): unknown {
  switch (valueType) {
    // deep copy
    case "ArrayBuffer": {
      const buffer = value as ArrayBuffer;

      return buffer.slice(0);
    }
    case "Boolean": {
      return Boolean((value as boolean).valueOf());
    }
    case "Buffer": {
      return /* #__INLINE__ */ cloneBuffer(value as Buffer);
    }
    // TODO: copy ArrayBuffer?
    case "DataView": {
      return new DataView((value as DataView).buffer);
    }
    case "Date": {
      return new Date((value as Date).getTime());
    }
    case "Number": {
      return Number(value as number);
    }
    case "RegExp": {
      return new RegExp((value as RegExp).source, (value as RegExp).flags);
    }
    case "String": {
      return String(value as string);
    }

    // typed arrays
    case "Float32Array": {
      return new Float32Array(value as Float32Array);
    }
    case "Float64Array": {
      return new Float64Array(value as Float64Array);
    }
    case "Int16Array": {
      return new Int16Array(value as Int16Array);
    }
    case "Int32Array": {
      return new Int32Array(value as Int32Array);
    }
    case "Int8Array": {
      return new Int8Array(value as Int8Array);
    }
    case "Uint16Array": {
      return new Uint16Array(value as Uint16Array);
    }
    case "Uint32Array": {
      return new Uint32Array(value as Uint32Array);
    }
    case "Uint8Array": {
      return new Uint8Array(value as Uint8Array);
    }
    case "Uint8ClampedArray": {
      return new Uint8ClampedArray(value as Uint8ClampedArray);
    }

    // shallow copy
    case "Array Iterator": {
      return value;
    }
    case "Map Iterator": {
      return value;
    }
    case "Promise": {
      return value;
    }
    case "Set Iterator": {
      return value;
    }
    case "String Iterator": {
      return value;
    }
    case "function": {
      return value;
    }
    case "global": {
      return value;
    }
    // NOTE: WeakMap and WeakSet cannot get entries
    case "WeakMap": {
      return value;
    }
    case "WeakSet": {
      return value;
    }

    // primitives
    case "boolean": {
      return value;
    }
    case "null": {
      return value;
    }
    case "number": {
      return value;
    }
    case "string": {
      return value;
    }
    case "symbol": {
      return value;
    }
    case "undefined": {
      return value;
    }

    // collections
    // NOTE: return empty value: because recursively copy later.
    case typeArguments: {
      return [];
    }
    case typeArray: {
      return [];
    }
    case typeMap: {
      return new Map<unknown, unknown>();
    }
    case typeObject: {
      return {};
    }
    case typeSet: {
      return new Set<unknown>();
    }

    // NOTE: type-detect returns following types
    // 'Location'
    // 'Document'
    // 'MimeTypeArray'
    // 'PluginArray'
    // 'HTMLQuoteElement'
    // 'HTMLTableDataCellElement'
    // 'HTMLTableHeaderCellElement'

    // TODO: is type-detect never return 'object'?
    // 'object'

    default: {
      return value;
    }
  }
}

type Customizer = (value: unknown, type: string) => unknown;

function copy(
  value: unknown,
  valueType: string,
  customizer: Customizer | null = null
): unknown {
  if (customizer && valueType === "Object") {
    const result = customizer(value, valueType);

    if (result !== undefined) {
      return result;
    }
  }

  return /* #__INLINE__ */ clone(value, valueType);
}

// NOTE: for the file size optimization
const typeArguments = "Arguments";
const typeArray = "Array";
const typeObject = "Object";
const typeMap = "Map";
const typeSet = "Set";

type Collection =
  | IArguments
  | Array<unknown>
  | Map<unknown, unknown>
  | Record<string | number | symbol, unknown>
  | Set<unknown>;

const collectionTypeSet = new Set([
  typeArguments,
  typeArray,
  typeMap,
  typeObject,
  typeSet
]);

function isCollection(valueType: string): boolean {
  return /* #__INLINE__ */ collectionTypeSet.has(valueType);
}

function getKeys(
  collection: Collection,
  collectionType: string
): Array<string | symbol> {
  switch (collectionType) {
    case typeArguments:
    case typeArray: {
      return Object.keys(collection as string[]);
    }
    case typeObject: {
      // eslint-disable-next-line unicorn/prefer-spread
      return ([] as Array<string | symbol>).concat(
        // NOTE: Object.getOwnPropertyNames can get all own keys.
        Object.keys(collection as Record<string, unknown>),
        Object.getOwnPropertySymbols(collection as Record<symbol, unknown>)
      );
    }
    case typeMap:
    case typeSet: {
      return [...(collection as Set<string | symbol>).keys()];
    }
    default: {
      return [];
    }
  }
}

function getValue(
  collection: Collection,
  key: unknown,
  collectionType: string
): unknown {
  switch (collectionType) {
    case typeArguments:
    case typeArray:
    case typeObject: {
      return (collection as Record<string, unknown>)[key as string];
    }
    case typeMap: {
      return (collection as Map<unknown, unknown>).get(key);
    }
    case typeSet: {
      // NOTE: Set.prototype.keys is alias of Set.prototype.values. It means key equals to value.
      return key;
    }
    default:
  }
}

function setValue(
  collection: Collection,
  key: unknown,
  value: unknown,
  collectionType: string
): Collection {
  switch (collectionType) {
    case typeArguments:
    case typeArray:
    case typeObject: {
      (collection as Record<string, unknown>)[key as string] = value;
      break;
    }
    case typeMap: {
      (collection as Map<unknown, unknown>).set(key, value);
      break;
    }
    case typeSet: {
      (collection as Set<unknown>).add(value);
      break;
    }
    default:
  }

  return collection;
}

function detectType(value: unknown): string {
  // NOTE: isBuffer must execute before type-detect,
  // because type-detect returns 'Uint8Array'.
  if (/* #__INLINE__ */ isBuffer(value)) {
    return "Buffer";
  }

  return typeDetect(value);
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
