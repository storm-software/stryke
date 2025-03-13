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

import type { ValidationDetails } from "./validations";

export enum FileStatus {
  INITIALIZED = "initialized",
  VALIDATED = "validated",
  UPLOADED = "uploaded",
  FAILED = "failed"
}

/**
 * A type that representing a file object.
 */
export type FileResult = {
  name: string;
  status: FileStatus;
  issues?: ValidationDetails[];
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
