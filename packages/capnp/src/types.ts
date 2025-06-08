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

/* eslint-disable camelcase */

import type {
  CodeGeneratorRequest,
  CodeGeneratorRequest_RequestedFile,
  CodeGeneratorRequest_RequestedFile_Import,
  Field,
  Node
} from "capnp-es/capnp/schema";
import type ts from "typescript";

export interface CodeGeneratorFileContext {
  // inputs
  readonly nodes: Node[];
  readonly imports: CodeGeneratorRequest_RequestedFile_Import[];

  // outputs
  concreteLists: Array<[string, Field]>;
  generatedNodeIds: Set<string>;
  generatedResultsPromiseIds: Set<bigint>;
  tsPath: string;
  codeParts?: string[];

  constructor: (
    req: CodeGeneratorRequest,
    file: CodeGeneratorRequest_RequestedFile
  ) => any;

  toString: () => string;
}

export interface CodeGeneratorContext {
  files: CodeGeneratorFileContext[];
}

export interface CapnpcCLIOptions {
  ts?: boolean;
  js?: boolean;
  dts?: boolean;
  schema: string[];
  output?: string;
  importPath?: string[];
  tsconfig: string;
  generateId?: boolean;
  standardImport?: boolean;
}

export type CapnpcOptions = Omit<CapnpcCLIOptions, "tsconfig"> & {
  tsconfig: ts.ParsedCommandLine;
};

export interface CapnpcResult {
  ctx: CodeGeneratorContext;
  files: Map<string, string>;
}
