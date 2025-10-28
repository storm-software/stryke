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

/* eslint-disable camelcase */

import type {
  CodeGeneratorRequest_RequestedFile_Import,
  Field,
  Node
} from "capnp-es/capnp/schema";
// eslint-disable-next-line ts/consistent-type-imports
import { ParsedCommandLine } from "typescript";

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

  constructor: any;

  toString: () => string;
}

export class CodeGeneratorContext {
  files: CodeGeneratorFileContext[] = [];
}

export interface CapnpcCLIOptions {
  noTs?: boolean;
  js?: boolean;
  dts?: boolean;
  noDts?: boolean;
  schema?: string;
  output?: string;
  importPath?: string;
  tsconfig?: string;
  skipGenerateId?: boolean;
  noStandardImport?: boolean;
  projectRoot?: string;
  workspaceRoot?: string;
  tty?: boolean;
}

export type CapnpcOptions = Omit<CapnpcCLIOptions, "tsconfig" | "schema"> & {
  schemas: string | string[];
} & (
    | {
        tsconfig: ParsedCommandLine;
        tsconfigPath?: string;
      }
    | {
        tsconfig?: ParsedCommandLine;
        tsconfigPath: string;
      }
  );

export type CapnpcResolvedOptions = Omit<
  CapnpcOptions,
  | "noTs"
  | "noDts"
  | "schemas"
  | "tsconfigPath"
  | "output"
  | "importPath"
  | "projectRoot"
  | "workspaceRoot"
> &
  Required<Pick<CapnpcOptions, "output" | "projectRoot" | "workspaceRoot">> & {
    ts: boolean;
    importPath: string[];
    schemas: string[];
    tsconfig: ParsedCommandLine;
  };

export interface CapnpcResult {
  ctx: CodeGeneratorContext;
  files: Map<string, string>;
}
