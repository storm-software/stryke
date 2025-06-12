/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { parse as parseToml, stringify as stringifyToml } from "@ltd/j-toml";
import defu from "defu";
import { readFile, readFileSync } from "./read-file";
import { writeFile, writeFileSync } from "./write-file";

export type XOptions = null | {
  readonly keys?: null | RegExp;
  readonly order?: boolean;
  readonly exact?: boolean;
  readonly multi?: boolean;
  readonly longer?: boolean;
  readonly string?: boolean;
  readonly comment?: boolean;
  readonly literal?: boolean;
  readonly null?: boolean;
  readonly tag?:
    | null
    | (<
        Table extends object & { [key: string | symbol]: any },
        Key extends string | symbol,
        Array extends any[],
        Index extends number,
        Tag extends string
      >(
        this: void,
        each:
          | { table: Table; key: Key; tag: Tag }
          | { array: Array; index: Index; tag: Tag }
          | { table: Table; key: Key; array: Array; index: Index; tag: Tag }
      ) => void);
};

export interface TomlReadOptions {
  specificationVersion?: 1.0 | 0.5 | 0.4 | 0.3 | 0.2 | 0.1;
  multilineStringJoiner?: string;
  useBigInt?: boolean | number;
  xOptions?: XOptions;
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param options - TOML parse options
 * @returns Object the TOML content of the file represents
 */
export function readTomlFileSync<T extends object = any>(
  path: string,
  options?: TomlReadOptions
): T {
  const content = readFileSync(path);

  return (
    options?.specificationVersion
      ? parseToml(
          content,
          options.specificationVersion,
          options?.multilineStringJoiner,
          options?.useBigInt,
          options?.xOptions
        )
      : parseToml(content)
  ) as T;
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param options - TOML parse options
 * @returns Object the TOML content of the file represents
 */
export async function readTomlFile<T extends object = any>(
  path: string,
  options?: TomlReadOptions
): Promise<T> {
  const content = await readFile(path);

  return (
    options?.specificationVersion
      ? parseToml(
          content,
          options.specificationVersion,
          options?.multilineStringJoiner,
          options?.useBigInt,
          options?.xOptions
        )
      : parseToml(content)
  ) as T;
}

export interface TomlWriteOptions {
  integer?: number;
  newline?: "\n" | "\r\n";
  newlineAround?: "document" | "section" | "header" | "pairs" | "pair";
  indent?: string | number;
  T?: "T" | "t" | " ";
  Z?: "Z" | "z";
  xNull?: boolean;
  xBeforeNewlineInMultilineTable?: "," | "";
  forceInlineArraySpacing?: 0 | 1 | 2 | 3;
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param data - data which should be serialized/formatted to TOML and written to the file
 * @param options - TOML parse options
 */
export function writeTomlFileSync<T extends object = any>(
  path: string,
  data: T,
  options?: TomlWriteOptions
): void {
  return writeFileSync(
    path,
    stringifyToml(
      data as any,
      defu(options ?? {}, {
        newline: "\n",
        newlineAround: "pairs",
        indent: 4,
        forceInlineArraySpacing: 1
      }) as TomlWriteOptions
    )
  );
}

/**
 * Reads a TOML file and returns the object the TOML content represents.
 *
 * @param path - A path to a file.
 * @param data - data which should be serialized/formatted to TOML and written to the file
 * @param options - TOML parse options
 */
export async function writeTomlFile<T extends object = any>(
  path: string,
  data: T,
  options?: TomlWriteOptions
): Promise<void> {
  return writeFile(
    path,
    stringifyToml(
      data as any,
      defu(options ?? {}, {
        newline: "\n",
        newlineAround: "pairs",
        indent: 4,
        forceInlineArraySpacing: 1
      }) as TomlWriteOptions
    )
  );
}
