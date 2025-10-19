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

import type { ValidationDetail } from "./validations";

export type FileStatus = "initialized" | "validated" | "uploaded" | "failed";

/**
 * A type that representing a file object.
 */
export type FileResult = {
  name: string;
  status: FileStatus;
  issues?: ValidationDetail[];
  size?: number;
  mimeType?: string;
  lastModified?: number;
} & (
  | {
      uri: string;
      file?: File;
    }
  | {
      uri?: string;
      file: File;
    }
);

/**
 * A valid `picomatch` glob pattern, or array of patterns.
 */
export type FilterPattern =
  | ReadonlyArray<string | RegExp>
  | string
  | RegExp
  | null;

export interface FileInputOutput {
  input: string;
  output: string;
}

/**
 * An interface got representing an asset files with glob patterns.
 */
export type AssetGlob = Required<Omit<FileInputOutput, "input">> &
  Partial<Pick<FileInputOutput, "input">> & {
    /**
     * A glob pattern to match files.
     */
    glob: string;

    /**
     * An array of glob patterns to ignore files.
     */
    ignore?: string[];

    /**
     * Include `.dot` files in normal matches and `globstar` matches. Note that an explicit dot in a portion of the pattern will always match dot files.
     *
     * @defaultValue true
     */
    dot?: boolean;
  };
