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

/* eslint-disable no-unused-vars */

export type JsonObject = { [Key in string]: JsonValue } & {
  [Key in string]?: JsonValue | undefined;
};

/**
 * Matches a JSON array.
 *
 * @category JSON
 */
export type JsonArray = JsonValue[] | readonly JsonValue[];

/**
 * Matches any valid JSON primitive value.
 *
 * @category JSON
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Matches any valid JSON value.
 *
 * @see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.
 *
 * @category JSON
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Matches a JSON pointer's path segments.
 *
 * @remarks
 * These segments are used to navigate through the JSON object structure and point to a specific, referenced value.
 */
export type JsonPointerPath = (string | number)[];

/**
 * Create a type with the keys of the given type changed to `string` type.
 *
 * Use-case: Changing interface values to strings in order to use them in a form model.
 *
 * @example
 * ```
 * import type {Stringified} from 'type-fest';
 *
 * type Car = {
 *  model: string;
 *  speed: number;
 * }
 *
 * const carForm: Stringified<Car> = {
 *  model: 'Foo',
 *  speed: '101'
 * };
 * ```
 *
 * @category Object
 */
export type Stringified<ObjectType> = { [KeyType in keyof ObjectType]: string };

/**
 * Get keys of the given type as strings.
 *
 * Number keys are converted to strings.
 *
 * Use-cases:
 * - Get string keys from a type which may have number keys.
 * - Makes it possible to index using strings retrieved from template types.
 *
 * @example
 * ```
 * import type {StringKeyOf} from 'type-fest';
 *
 * type Foo = {
 *  1: number,
 *  stringKey: string,
 * };
 *
 * type StringKeysOfFoo = StringKeyOf<Foo>;
 * //=> '1' | 'stringKey'
 * ```
 *
 * @category Object
 */
export type StringKeyOf<BaseType> =
  `${Extract<keyof BaseType, string | number>}`;
