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

import type { DMMF } from "@prisma/generator-helper";

export interface AggregateOperationSupport {
  [model: string]: {
    count?: boolean;
    min?: boolean;
    max?: boolean;
    sum?: boolean;
    avg?: boolean;
  };
}

export interface PrismaEnums {
  model?: DMMF.SchemaEnum[];
  prisma: DMMF.SchemaEnum[];
}

export interface PrismaSchemaEnum {
  name: string;
  values: string[];
}

export type RootType = Array<string>;

export type Writeable<T> =
  // check for things that are objects but don't need changing
  T extends ((...args: any[]) => any) | Date | RegExp
    ? T
    : T extends ReadonlyMap<infer K, infer V> // maps
      ? Map<Writeable<K>, Writeable<V>> // make key and values writable
      : T extends ReadonlySet<infer U> // sets
        ? Set<Writeable<U>> // make elements writable
        : T extends ReadonlyArray<unknown> // is an array or tuple?
          ? `${bigint}` extends `${keyof T & any}` // is tuple
            ? { -readonly [K in keyof T]: Writeable<T[K]> }
            : Writeable<T[number]>[] // is regular array
          : T extends object // is regular object
            ? { -readonly [K in keyof T]: Writeable<T[K]> }
            : T; // is primitive or literal value

export type SchemaArgInputTypes = Writeable<DMMF.SchemaArg["inputTypes"]>;

export interface TransformerParams {
  enumTypes?: Writeable<DMMF.SchemaEnum[]>;
  fields?: Writeable<DMMF.SchemaArg[]>;
  name?: string;
  models?: Writeable<DMMF.Model[]>;
  modelOperations?: Writeable<DMMF.ModelMapping[]>;
  aggregateOperationSupport?: AggregateOperationSupport;
  isDefaultPrismaClientOutput?: boolean;
  prismaClientOutputPath?: string;
}
