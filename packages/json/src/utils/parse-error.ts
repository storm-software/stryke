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

import type { ParseError } from "jsonc-parser";
import { printParseErrorCode } from "jsonc-parser";
import { LinesAndColumns } from "lines-and-columns";
import { codeFrameColumns } from "./code-frames";

/**
 * Nicely formats a JSON error with context
 *
 * @param input - JSON content as string
 * @param parseError - jsonc ParseError
 * @returns
 */
export function formatParseError(input: string, parseError: ParseError) {
  const { error, offset, length } = parseError;
  const result = new LinesAndColumns(input).locationForIndex(offset);
  let line = result?.line ?? 0;
  let column = result?.column ?? 0;

  line++;
  column++;

  return (
    `${printParseErrorCode(error)} in JSON at ${line}:${column}\n${
      codeFrameColumns(input, {
        start: {
          line,
          column
        },
        end: {
          line,
          column: column + length
        }
      })
    }\n`
  );
}
