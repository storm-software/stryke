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

import type { TypedArray } from "./array";

/**
 * Matches any value that can be serialized to JSON.
 *
 * @remarks
 * This includes all primitive types except `symbol`, which cannot be serialized.
 */
export type SerializablePrimitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | bigint;

/**
 * Matches any primitive JavaScript value.
 *
 * @remarks
 * Includes `SerializablePrimitive` types plus `symbol`, which cannot be serialized to JSON.
 *
 * @example
 * ```ts
 * type test = Primitive;
 * // null | undefined | string | number | boolean | bigint | symbol
 * ```
 */
export type Primitive = SerializablePrimitive | symbol;

/**
 * Matches any primitive, `void`, `Date`, or `RegExp` value.
 */
export type BuiltIns = Primitive | void | Date | RegExp;

/**
 * Matches any non-primitive object
 */
// eslint-disable-next-line ts/no-unsafe-function-type
export type AtomicObject = Function | Promise<any> | Date | RegExp;

/** Determines if the passed value is of a specific type */
/**
 * A function that tests whether a value matches a specific type.
 *
 * @param value - The value to test
 * @returns `true` if the value matches the type, `false` otherwise
 *
 * @example
 * ```ts
 * const isString: TypeTester = (value) => typeof value === 'string';
 * ```
 */
export type TypeTester = (value: any) => boolean;

/**
 * The interface for a type mapping (key =\> function) to use for {@link getType}.
 * export * The key represents the name of the type. The function represents the {@link TypeTester | test method}.
 * The map should be ordered by testing preference, with more specific tests first.
 * If a test returns true, it is selected, and the key is returned as the type.
 */
/**
 * A mapping of type names to type testing functions.
 *
 * @remarks
 * The map should be ordered by testing preference, with more specific tests first. When a test returns `true`, it is selected and the corresponding key is returned as the type name.
 *
 * @see {@link TypeTester}
 * @see {@link getType}
 *
 * @example
 * ```ts
 * const typeMap: TypeMap = {
 *   string: (v) => typeof v === 'string',
 *   number: (v) => typeof v === 'number',
 *   array: (v) => Array.isArray(v),
 * };
 * ```
 */
export type TypeMap = Record<string, TypeTester>;

declare const emptyObjectSymbol: unique symbol;

export type FunctionOrValue<Value> = Value extends () => infer X ? X : Value;

/**
 * A [[List]]
 *
 * @example
 * ```ts
 * type list0 = [1, 2, 3]
 * type list1 = number[]
 * ```
 *
 * @param A - its type
 * @returns [[List]]
 */
export type List<A = any> = ReadonlyArray<A>;

/**
 * Alias to create a [[Function]]
 *
 * @example
 * ```ts
 * import { FunctionLike } from '@stryke/types'
 *
 * type test0 = FunctionLike<[string, number], boolean>
 * /// (args_0: string, args_1: number) => boolean
 * ```
 *
 * @param P - parameters
 * @param R - return type
 * @returns [[Function]]
 */
export type FunctionLike<P extends List = any, R = any> = (...args: P) => R;

export type AnyFunction = FunctionLike<any, any>;
export type Nullish = undefined | null;
export type Nullishable<T> = T | Nullish;
export type NonNullishObject = object; // not null/undefined which are Object
export type NativeClass = abstract new (...args: any) => any;
/**
 * Matches any number type.
 */
export type AnyNumber = number | number;

/**
 * Matches any string type.
 */
export type AnyString = string | string;

/**
 * Matches any boolean type.
 */
export type AnyBoolean = boolean | boolean;
/**
 * Matches an array of any type.
 */
export type AnyArray = any[];

/**
 * Matches a plain object (POJO) with any key-value pairs.
 *
 * @see https://stackoverflow.com/a/75052315/130638
 */
export type PlainObject = Record<any, object>;

/**
 * Matches a `Map` with any key and value types.
 */
export type AnyMap = Map<any, any>;

/**
 * Matches a `WeakMap` with any key and value types.
 */
export type AnyWeakMap = WeakMap<WeakKey, any>;
/**
 * Matches an empty array type.
 */
export type EmptyArray = [];
export interface EmptyObject {
  [emptyObjectSymbol]?: never;
}

/**
 * Matches any JavaScript value, including primitives and objects.
 */
export type Any =
  | boolean
  | number
  | bigint
  | string
  | null
  | undefined
  | void
  | symbol
  | object
  | PlainObject
  | AnyArray
  | AnyMap
  | AnyWeakMap;

/**
 * The valid types of the index for an `Indexable` type object
 */
export type IndexType = string | number | symbol;

/**
 * The declaration of a ***dictionary-type*** object with a specific type
 *
 * @see {@link Indexable}
 * @see {@link IndexType}
 * @see {@link Dictionary}
 */
export type TypedIndexable<T> = Record<IndexType, T>;

/**
 * The declaration of a ***dictionary-type*** object
 *
 * @see {@link TypedIndexable}
 * @see {@link IndexType}
 * @see {@link Dictionary}
 */
export type Indexable = TypedIndexable<any>;

/**
 * The declaration of a ***dictionary-type*** object with a specific type
 *
 * @see {@link Indexable}
 * @see {@link IndexType}
 * @see {@link TypedIndexable}
 */
export type Dictionary<T> = Record<string, T>;

export const EMPTY_STRING = "";
export const NEWLINE_STRING = "\r\n";
export const EMPTY_OBJECT = {};

/**
 * Matches a string type where each character can be either uppercase or lowercase.
 *
 * @remarks
 * This is useful for creating case-insensitive string literal unions.
 *
 * @example
 * ```ts
 * type CaseInsensitive = AnyCase<'hello'>;
 * // 'hello' | 'Hello' | 'hEllo' | 'HEllo' | ...
 * ```
 */
export type AnyCase<T extends IndexType> = string extends T
  ? string
  : T extends `${infer F1}${infer F2}${infer R}`
    ? `${Uppercase<F1> | Lowercase<F1>}${Uppercase<F2> | Lowercase<F2>}${AnyCase<R>}`
    : T extends `${infer F}${infer R}`
      ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}`
      : typeof EMPTY_STRING;

/**
 * Matches a constructor function that returns an instance of type `T`.
 *
 * @example
 * ```ts
 * class MyClass {}
 * type MyClassConstructor = Newable<MyClass>;
 * ```
 */
export type Newable<T> = new (..._args: never[]) => T;

/**
 * Matches an abstract class with the given prototype.
 *
 * @example
 * ```ts
 * abstract class Base {}
 * type BaseAbstract = Abstract<Base>;
 * ```
 */
export interface Abstract<T> {
  prototype: T;
}

/**
 * Matches an object that has a `clone()` method returning a copy of itself.
 */
export interface Clonable<T> {
  clone: () => T;
}

/**
 * Matches a value that is either of type `T` or a promise that resolves to `T`.
 *
 * @example
 * ```ts
 * type Result = MaybePromise<string>;
 * // string | Promise<string>
 * ```
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Matches a reducer function that takes the current state and an action, returning the next state.
 *
 * @remarks
 * This is the function signature used in state management libraries like Redux.
 *
 * @example
 * ```ts
 * type CounterReducer = ReducerFunction<number, { type: 'increment' | 'decrement' }>;
 * const reducer: CounterReducer = (state, action) => {
 *   return action.type === 'increment' ? state + 1 : state - 1;
 * };
 * ```
 */
export type ReducerFunction<TState, TAction> = (
  state: TState,
  action: TAction
) => TState;

// NOTE: for the file size optimization
export const TYPE_ARGUMENTS = "Arguments";
export const TYPE_ARRAY = "Array";
export const TYPE_OBJECT = "Object";
export const TYPE_MAP = "Map";
export const TYPE_SET = "Set";

/**
 * Matches any collection type including arrays, maps, sets, and plain objects.
 */
export type Collection =
  | IArguments
  | unknown[]
  | Map<unknown, unknown>
  | Record<string | number | symbol, unknown>
  | Set<unknown>;

/**
 * Removes `undefined` from a union type.
 *
 * @example
 * ```ts
 * type test = NonUndefined<string | undefined>;
 * // string
 * ```
 */
export type NonUndefined<T> = T extends undefined ? never : T;

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
      // eslint-disable-next-line ts/no-unsafe-function-type
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
export type Cast<A1, A2> = A1 extends A2 ? A1 : A2;

/**
 * Matches browser native object types that should not be recursively transformed.
 */
export type BrowserNativeObject = Date | File;

type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Recursively makes all properties of an object type optional, except for properties that are of a primitive type or a browser native object type. The `D` parameter is used to limit the depth of the recursion to prevent infinite recursion in case of circular references. By default, the depth is set to 10, which should be sufficient for most use cases.
 *
 * @remarks
 * - This type is useful when you want to create a new type that has the same structure as an existing type, but with all properties being optional. For example, when you want to create a type for a partial update of an object.
 * - The properties that are of a primitive type or a browser native object type are not made optional because they are already immutable and do not have nested properties that can be made optional.
 */
export type DeepPartial<T, D extends number = 10> = D extends 0
  ? T
  : T extends BrowserNativeObject | NestedValue
    ? T
    : {
        [K in keyof T]?: T[K] extends object
          ? DeepPartial<T[K], Depth[D]>
          : T[K];
      };

/**
 * Recursively makes all properties of an object type required.
 *
 * @remarks
 * - Properties that are primitives or browser native objects are left as-is.
 * - The `D` parameter controls recursion depth (default: 10) to prevent infinite recursion with circular references.
 * - More strict than `Required<T>` as it recursively applies to nested objects.
 *
 * @example
 * ```ts
 * type User = { name?: string; address?: { street?: string } };
 * type RequiredUser = DeepRequired<User>;
 * // { name: string; address: { street: string } }
 * ```
 */
export type DeepRequired<T, D extends number = 10> = D extends 0
  ? T
  : T extends BrowserNativeObject | NestedValue
    ? T
    : {
        [K in keyof T]-?: T[K] extends object
          ? DeepRequired<T[K], Depth[D]>
          : T[K];
      };

/**
 * Recursively removes `null` and `undefined` from all properties of an object type.
 *
 * @remarks
 * - Properties that are primitives or browser native objects have their null/undefined removed.
 * - The `D` parameter controls recursion depth (default: 10) to prevent infinite recursion with circular references.
 * - More strict than `NonNullable<T>` as it recursively applies to nested objects.
 *
 * @example
 * ```ts
 * type User = { name: string | null; address: { street: string | null } | null };
 * type NonNullableUser = DeepNonNullable<User>;
 * // { name: string; address: { street: string } }
 * ```
 */
export type DeepNonNullable<T, D extends number = 10> = D extends 0
  ? T
  : T extends BrowserNativeObject | NestedValue
    ? T
    : {
        [K in keyof T]: T[K] extends object
          ? DeepNonNullable<T[K], Depth[D]>
          : NonNullable<T[K]>;
      };

/**
 * Recursively makes all properties of an object type readonly.
 *
 * @remarks
 * - Properties that are primitives or browser native objects are marked readonly.
 * - The `D` parameter controls recursion depth (default: 10) to prevent infinite recursion with circular references.
 * - More strict than `Readonly<T>` as it recursively applies to nested objects.
 *
 * @example
 * ```ts
 * type User = { name: string; address: { street: string } };
 * type ReadonlyUser = DeepReadonly<User>;
 * // { readonly name: string; readonly address: { readonly street: string } }
 * ```
 */
export type DeepReadonly<T, D extends number = 10> = D extends 0
  ? T
  : T extends BrowserNativeObject | NestedValue
    ? T
    : {
        readonly [K in keyof T]: T[K] extends object
          ? DeepReadonly<T[K], Depth[D]>
          : T[K] extends Array<infer U>
            ? ReadonlyArray<DeepReadonly<U, Depth[D]>>
            : T[K];
      };

/**
 * Recursively makes all properties of an object type readonly and removes `null`/`undefined`.
 *
 * @remarks
 * - Combines the effects of `DeepReadonly` and `DeepNonNullable`.
 * - The `D` parameter controls recursion depth (default: 10) to prevent infinite recursion with circular references.
 *
 * @example
 * ```ts
 * type User = { name?: string | null; address?: { street?: string | null } };
 * type ReadonlyUser = DeepReadonlyNonNullable<User>;
 * // { readonly name: string; readonly address: { readonly street: string } }
 * ```
 */
export type DeepReadonlyNonNullable<T, D extends number = 10> = D extends 0
  ? T
  : T extends BrowserNativeObject | NestedValue
    ? T
    : {
        readonly [K in keyof T]: T[K] extends object
          ? DeepReadonlyNonNullable<T[K], Depth[D]>
          : NonNullable<T[K]>;
      };

/**
 * Recursively makes all properties of an object type readonly and explicitly nullable.
 *
 * @remarks
 * - Similar to `DeepReadonly`, but ensures all leaf properties are `| null`.
 * - The `D` parameter controls recursion depth (default: 10) to prevent infinite recursion with circular references.
 *
 * @example
 * ```ts
 * type User = { name: string; address: { street: string } };
 * type ReadonlyUser = DeepReadonlyNullable<User>;
 * // { readonly name: string | null; readonly address: { readonly street: string | null } }
 * ```
 */
export type DeepReadonlyNullable<T, D extends number = 10> = D extends 0
  ? T
  : T extends BrowserNativeObject | NestedValue
    ? T
    : {
        readonly [K in keyof T]: T[K] extends object
          ? DeepReadonlyNullable<T[K], Depth[D]>
          : T[K] | null;
      };

/**
 * A mapping of property names to rollback functions.
 *
 * @remarks
 * Each rollback function takes the initial value and current value, and returns the value to rollback to.
 *
 * @example
 * ```ts
 * const rollbacks: Rollback = {
 *   count: (initial, current) => initial,
 *   timestamp: (initial, current) => Date.now(),
 * };
 * ```
 */
export type Rollback = Record<
  string,
  (initialValue: any, currentValue: any) => any
>;

/**
 * Extract all required keys from the given type.
 *
 * @remarks
 * This is useful when you want to create a new type that contains different type values for the required keys only or use the list of keys for validation purposes, etc...
 */
export type RequiredKeysOf<BaseType extends object> = Exclude<
  {
    [Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]>
      ? Key
      : never;
  }[keyof BaseType],
  undefined
>;

/**
 * Returns a boolean for whether the two given types are equal.
 *
 * @remarks
 * Use-cases: If you want to make a conditional branch based on the result of a comparison of two types.
 *
 * @see https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
 * @see https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796
 */
export type IsEqual<A, B> =
  (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
    ? true
    : false;

/**
 * Filters out a specific type from a union.
 *
 * @remarks
 * Removes `ExcludeType` from `KeyType` if they are equal or if `KeyType` extends `ExcludeType`.
 *
 * @example
 * ```ts
 * type test = Filter<'a' | 'b' | 'c', 'b'>;
 * // 'a' | 'c'
 * ```
 */
export type Filter<KeyType, ExcludeType> =
  IsEqual<KeyType, ExcludeType> extends true
    ? never
    : KeyType extends ExcludeType
      ? never
      : KeyType;

interface ExceptOptions {
  /**
    Disallow assigning non-specified properties.

    Note that any omitted properties in the resulting type will be present in autocomplete as `undefined`.

    @defaultValue  false
   */
  requireExactProps?: boolean;
}

/**
 * Create a type from an object type without certain keys.
 *
 * @remarks
 * We recommend setting the `requireExactProps` option to `true`.
 *
 * This type is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type). The `Omit` type does not restrict the omitted keys to be keys present on the given type, while `Except` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.
 *
 * This type was proposed to the TypeScript team, which declined it, saying they prefer that libraries implement stricter versions of the built-in types ([microsoft/TypeScript#30825](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235)).
 */
export type Except<
  ObjectType,
  KeysType extends keyof ObjectType,
  Options extends ExceptOptions = { requireExactProps: false }
> = {
  [KeyType in keyof ObjectType as Filter<
    KeyType,
    KeysType
  >]: ObjectType[KeyType];
} & (Options["requireExactProps"] extends true
  ? Partial<Record<KeysType, never>>
  : Record<string, never>);

/**
 * Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.
 *
 * @remarks
 * Sometimes it is desired to pass a value as a function argument that has a different type. At first inspection it may seem assignable, and then you discover it is not because the `value`'s type definition was defined as an interface. In the following example, `fn` requires an argument of type `Record<string, unknown>`. If the value is defined as a literal, then it is assignable. And if the `value` is defined as type using the `Simplify` utility the value is assignable.  But if the `value` is defined as an interface, it is not assignable because the interface is not sealed and elsewhere a non-string property could be added to the interface.
 *
 * If the type definition must be an interface (perhaps it was defined in a third-party npm package), then the `value` can be defined as `const value: Simplify<SomeInterface> = ...`. Then `value` will be assignable to the `fn` argument.  Or the `value` can be cast as `Simplify<SomeInterface>` if you can't re-declare the `value`.
 *
 * @see https://github.com/microsoft/TypeScript/issues/15300
 */
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

/**
 * Create a type that makes the given keys required. The remaining keys are kept as is.
 *
 * @remarks
 * Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.
 */
export type RequiredKeys<BaseType, Keys extends keyof BaseType> = Required<
  Pick<BaseType, Keys>
> &
  Omit<BaseType, Keys>;

/**
 * Create a type that makes the given keys optional. The remaining keys are kept as is.
 *
 * @remarks
 * Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are optional.
 */
export type PartialKeys<BaseType, Keys extends keyof BaseType> = Partial<
  Pick<BaseType, Keys>
> &
  Omit<BaseType, Keys>;

export const $NestedValue: unique symbol = Symbol("NestedValue");

/**
 * Marks an object as a nested value that should not be recursively transformed.
 *
 * @remarks
 * Used internally by deep utility types to prevent recursion on certain values.
 *
 * @example
 * ```ts
 * type Special = NestedValue<{ custom: unknown }>;
 * ```
 */
export type NestedValue<TValue extends object = object> = {
  [$NestedValue]: never;
} & TValue;

/**
 * A mutable reference object that holds a current value.
 *
 * @remarks
 * Commonly used in React for holding mutable values that persist across renders.
 *
 * @example
 * ```ts
 * type InputRef = RefObject<HTMLInputElement>;
 * const inputRef: RefObject<HTMLInputElement> = { current: null };
 * ```
 */
export interface RefObject<T> {
  current: T;
}

/**
 * Matches an object that has an `id` property of type `T`.
 *
 * @remarks
 * By default, the `id` property is of type `string`.
 *
 * @example
 * ```ts
 * interface User extends Identity<number> {
 *   name: string;
 * }
 * // { id: number; name: string }
 * ```
 */
export interface Identity<T = string> {
  id: T;
}

/**
 * Matches an object that has a `version` property.
 *
 * @remarks
 * Useful for tracking or managing different versions of data or entities.
 *
 * @example
 * ```ts
 * interface Document extends Versioned {
 *   content: string;
 * }
 * // { version: number; content: string }
 * ```
 */
export interface Versioned {
  version: number;
}

export interface Sequenced {
  /**
   * The sequence number (version, or event counter, etc.) of the record
   */
  sequence: number;
}

/**
 * Matches an object that declares its type via a `__type` property.
 *
 * @remarks
 * Useful for runtime type discrimination and serialization.
 *
 * @example
 * ```ts
 * interface Animal extends Typed {
 *   name: string;
 * }
 * const dog: Animal = { __type: 'dog', name: 'Fido' };
 * ```
 */
export interface Typed {
  /**
   * The type of the record
   */
  __type: string;
}

/**
 * Matches a class or object that can perform type checking on values.
 *
 * @remarks
 * Extends `Typed` to include a type guard function for runtime type checking.
 *
 * @example
 * ```ts
 * class User implements ClassTypeCheckable<User> {
 *   __type = 'user';
 *   isTypeOf(value: unknown): value is User {
 *     return value instanceof User;
 *   }
 * }
 * ```
 */
export interface ClassTypeCheckable<T> extends Typed {
  /**
   * Run type check on the given value
   * @param value - The value to check
   * @returns True if the value is of the type of the class
   */
  isTypeOf: (value: unknown) => value is T;
}

/**
 * Matches non-recursive types.
 */
export type NonRecursiveType =
  | BuiltIns
  // eslint-disable-next-line ts/no-unsafe-function-type
  | Function
  | (new (...arguments_: any[]) => unknown);

/**
 * Returns `true` if type `T` is a primitive type, `false` otherwise.
 *
 * @example
 * ```ts
 * type test1 = IsPrimitive<string>; // true
 * type test2 = IsPrimitive<object>; // false
 * ```
 */
export type IsPrimitive<T> = [T] extends [Primitive] ? true : false;

/**
 * Returns `true` if type `T` is `never`, `false` otherwise.
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Returns `true` if type `T` is `any`, `false` otherwise.
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Returns `true` if type `T` is `null`, `false` otherwise.
 */
export type IsNull<T> = [T] extends [null] ? true : false;

/**
 * Returns `true` if type `T` is `undefined`, `false` otherwise.
 */
export type IsUndefined<T> = T extends undefined ? true : false;

/**
 * Returns `true` if type `T` is `unknown`, `false` otherwise.
 */
export type IsUnknown<T> = unknown extends T
  ? IsNull<T> extends false
    ? true
    : false
  : false;

/**
 * Returns `true` if type `T` is `null | undefined`, `false` otherwise.
 */
export type IsNullish<T> = IsNull<T> & IsUndefined<T>;

/**
 * Returns `true` if type `T` is a function type, `false` otherwise.
 */
export type IsFunction<T> = T extends AnyFunction ? true : false;

/**
 * Declare locally scoped properties on `globalThis`.
 *
 * When defining a global variable in a declaration file is inappropriate, it can be helpful to define a `type` or `interface` (say `ExtraGlobals`) with the global variable and then cast `globalThis` via code like `globalThis as unknown as ExtraGlobals`.
 *
 * Instead of casting through `unknown`, you can update your `type` or `interface` to extend `GlobalThis` and then directly cast `globalThis`.
 *
 * @example
 * ```
 * import type { GlobalThis } from '@stryke/types';
 *
 * type ExtraGlobals = GlobalThis & {
 *   readonly GLOBAL_TOKEN: string;
 * };
 *
 * (globalThis as ExtraGlobals).GLOBAL_TOKEN;
 * ```
 */
export type GlobalThis = typeof globalThis;

/**
 * Matches a [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
 */
export interface Class<T, Arguments extends unknown[] = any[]> {
  prototype: Pick<T, keyof T>;
  new (...arguments_: Arguments): T;
}

/**
 * Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
 */
export type Constructor<T, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

/**
 * Matches an [`abstract class`](https://www.typescriptlang.org/docs/handbook/classes.html#abstract-classes).
 *
 * @privateRemarks
 * We cannot use a `type` here because TypeScript throws: 'abstract' modifier cannot appear on a type member. (1070)
 */

export interface AbstractClass<
  T,
  Arguments extends unknown[] = any[]
> extends AbstractConstructor<T, Arguments> {
  prototype: Pick<T, keyof T>;
}

/**
 * Matches an [`abstract class`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html#abstract-construct-signatures) constructor.
 */
export type AbstractConstructor<
  T,
  Arguments extends unknown[] = any[]
> = abstract new (...arguments_: Arguments) => T;

/**
 * Create a tuple type of the given length `<L>` and fill it with the given type `<Fill>`.
 *
 * If `<Fill>` is not provided, it will default to `unknown`.
 *
 * @see https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */
export type BuildTuple<
  L extends number,
  Fill = unknown,
  T extends readonly unknown[] = []
> = T["length"] extends L ? T : BuildTuple<L, Fill, [...T, Fill]>;

/**
 * Test if the given function has multiple call signatures.
 *
 * Needed to handle the case of a single call signature with properties.
 *
 * Multiple call signatures cannot currently be supported due to a TypeScript limitation.
 * @see https://github.com/microsoft/TypeScript/issues/29732
 */
export type HasMultipleCallSignatures<
  T extends (...arguments_: any[]) => unknown
> = T extends {
  (...arguments_: infer A): unknown;
  (...arguments_: infer B): unknown;
}
  ? B extends A
    ? A extends B
      ? false
      : true
    : true
  : false;

type StructuredCloneablePrimitive =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | boolean
  | number
  | string;

type StructuredCloneableData =
  | ArrayBuffer
  | DataView
  | Date
  | Error
  | RegExp
  | TypedArray
  | Blob
  | File;

// DOM exclusive types
// | AudioData
// | CropTarget
// | CryptoKey
// | DOMException
// | DOMMatrix
// | DOMMatrixReadOnly
// | DOMPoint
// | DOMPointReadOnly
// | DOMQuad
// | DOMRect
// | DOMRectReadOnly
// | FileList
// | FileSystemDirectoryHandle
// | FileSystemFileHandle
// | FileSystemHandle
// | GPUCompilationInfo
// | GPUCompilationMessage
// | ImageBitmap
// | ImageData
// | RTCCertificate
// | VideoFrame

type StructuredCloneableCollection =
  | readonly StructuredCloneable[]
  | {
      readonly [key: string]: StructuredCloneable;
      readonly [key: number]: StructuredCloneable;
    }
  | ReadonlyMap<StructuredCloneable, StructuredCloneable>
  | ReadonlySet<StructuredCloneable>;

/**
 * Matches a value that can be losslessly cloned using `structuredClone`.
 *
 * Note:
 * - Custom error types will be cloned as the base `Error` type
 * - This type doesn't include types exclusive to the TypeScript DOM library (e.g. `DOMRect` and `VideoFrame`)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 *
 * @example
 * ```
 * import type { StructuredCloneable } from '@stryke/types';
 *
 * class CustomClass {}
 *
 * // @ts-expect-error
 * const error: StructuredCloneable = {
 *     custom: new CustomClass(),
 * };
 *
 * structuredClone(error);
 * //=> {custom: {}}
 *
 * const good: StructuredCloneable = {
 *     number: 3,
 *     date: new Date(),
 *     map: new Map<string, number>(),
 * }
 *
 * good.map.set('key', 1);
 *
 * structuredClone(good);
 * //=> {number: 3, date: Date(2022-10-17 22:22:35.920), map: Map {'key' -> 1}}
 * ```
 */
export type StructuredCloneable =
  | StructuredCloneablePrimitive
  | StructuredCloneableData
  | StructuredCloneableCollection;

/**
 * Removes the `readonly` modifier from all fields of an object type.
 *
 * @template T - The object type to make mutable
 *
 * @example
 * ```
 * import type { Mutable } from '@stryke/types';
 *
 * type ReadonlyUser = {
 *   readonly name: string;
 *   readonly age: number;
 * };
 *
 * type User = Mutable<ReadonlyUser>;
 * // => { name: string; age: number; }
 * ```
 */
export type Mutable<T extends object> = {
  -readonly [K in keyof T]: T[K];
};
