/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { NegativeInfinity, PositiveInfinity } from "./number";

/**
 * Converts a numeric string to a number.
 *
 * @example
 * ```
 * type PositiveInt = StringToNumber<'1234'>;
 * //=> 1234
 *
 * type NegativeInt = StringToNumber<'-1234'>;
 * //=> -1234
 *
 * type PositiveFloat = StringToNumber<'1234.56'>;
 * //=> 1234.56
 *
 * type NegativeFloat = StringToNumber<'-1234.56'>;
 * //=> -1234.56
 *
 * type PositiveInfinity = StringToNumber<'Infinity'>;
 * //=> Infinity
 *
 * type NegativeInfinity = StringToNumber<'-Infinity'>;
 * //=> -Infinity
 * ```
 */
export type StringToNumber<S extends string> =
  S extends `${infer N extends number}`
    ? N
    : S extends "Infinity"
      ? PositiveInfinity
      : S extends "-Infinity"
        ? NegativeInfinity
        : never;

/**
 * Returns a boolean for whether the given string `S` starts with the given string `SearchString`.
 *
 * @example
 * ```
 * StartsWith<'abcde', 'abc'>;
 * //=> true
 *
 * StartsWith<'abcde', 'bc'>;
 * //=> false
 *
 * StartsWith<string, 'bc'>;
 * //=> never
 *
 * StartsWith<'abcde', string>;
 * //=> never
 * ```
 */
export type StartsWith<
  S extends string,
  SearchString extends string
> = string extends S | SearchString
  ? never
  : S extends `${SearchString}${string | number | bigint | boolean | null | undefined}`
    ? true
    : false;

/**
 * Returns the length of the given string.
 *
 * @example
 * ```
 * StringLength<'abcde'>;
 * //=> 5
 *
 * StringLength<string>;
 * //=> never
 * ```
 */
export type StringLength<S extends string> = string extends S
  ? never
  : StringToArray<S>["length"];

/**
 * Returns an array of the characters of the string.
 *
 * @example
 * ```
 * StringToArray<'abcde'>;
 * //=> ['a', 'b', 'c', 'd', 'e']
 *
 * StringToArray<string>;
 * //=> never
 * ```
 */
export type StringToArray<
  S extends string,
  Result extends string[] = []
> = string extends S
  ? never
  : S extends `${infer F}${infer R}`
    ? StringToArray<R, [...Result, F]>
    : Result;

export type UpperCaseCharacters =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

export type StringDigit =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";

export type Whitespace =
  | "\u{9}" // '\t'
  | "\u{A}" // '\n'
  | "\u{B}" // '\v'
  | "\u{C}" // '\f'
  | "\u{D}" // '\r'
  | "\u{20}" // ' '
  | "\u{85}"
  | "\u{A0}"
  | "\u{1680}"
  | "\u{2000}"
  | "\u{2001}"
  | "\u{2002}"
  | "\u{2003}"
  | "\u{2004}"
  | "\u{2005}"
  | "\u{2006}"
  | "\u{2007}"
  | "\u{2008}"
  | "\u{2009}"
  | "\u{200A}"
  | "\u{2028}"
  | "\u{2029}"
  | "\u{202F}"
  | "\u{205F}"
  | "\u{3000}"
  | "\u{FEFF}";

export type WordSeparators = "-" | "_" | Whitespace;
