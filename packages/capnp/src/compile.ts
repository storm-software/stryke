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

/* eslint-disable no-console */

import { createDirectory } from "@stryke/fs/helpers";
import { writeFile } from "@stryke/fs/write-file";
import { findFilePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { compileAll } from "capnp-es/compiler";
import { Buffer } from "node:buffer";
import { exec } from "node:child_process";
import { existsSync } from "node:fs";
import type { CapnpcOptions, CapnpcResult } from "./types";

/**
 * Compiles Cap'n Proto schemas into TypeScript files.
 *
 * @param options - The options for the compilation process.
 * @returns A promise that resolves to the compilation result.
 */
export async function capnpc(options: CapnpcOptions): Promise<CapnpcResult> {
  try {
    const { output, tsconfig, schemas = [] } = options;

    let dataBuf: Buffer = Buffer.alloc(0);
    if (!process.stdin.isTTY) {
      const chunks: Buffer[] = [];
      process.stdin.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      await new Promise(resolve => {
        process.stdin.on("end", resolve);
      });

      const reqBuffer = Buffer.alloc(
        chunks.reduce((l, chunk) => l + chunk.byteLength, 0)
      );

      let i = 0;
      for (const chunk of chunks) {
        chunk.copy(reqBuffer, i);
        i += chunk.byteLength;
      }

      dataBuf = reqBuffer;
    }

    if (dataBuf.byteLength === 0) {
      const opts: string[] = [];

      if (output) {
        opts.push(`-o-:${output}`);
      } else {
        opts.push("-o-");
      }

      dataBuf = await new Promise<Buffer>(resolve => {
        exec(
          `capnpc ${opts.join(" ")} ${schemas.join(" ")}`,
          { encoding: "buffer" },
          (error, stdout, stderr) => {
            if (stderr.length > 0) {
              process.stderr.write(stderr);
            }
            if (error) {
              throw error;
            }
            resolve(stdout);
          }
        );
      });
    }

    const result = await compileAll(dataBuf, {
      ts: options.ts ?? true,
      js: options.js ?? false,
      dts: options.dts ?? true,
      tsconfig: tsconfig?.options
    });

    for (const [fileName, content] of result.files) {
      let filePath = fileName;
      if (!existsSync(findFilePath(filePath))) {
        const fullPath = `/${filePath}`;
        if (existsSync(findFilePath(fullPath))) {
          filePath = fullPath;
        }
      }

      if (output) {
        filePath = joinPaths(output, fileName);
      }

      if (!existsSync(findFilePath(filePath))) {
        await createDirectory(findFilePath(filePath));
      }

      await writeFile(
        filePath,
        // https://github.com/microsoft/TypeScript/issues/54632
        content.replace(/^\s+/gm, match => " ".repeat(match.length / 2))
      );
    }

    return result as unknown as CapnpcResult;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      if (error.stack) {
        console.error(error.stack);
      }
    } else {
      console.error("An unknown error occurred:", error);
    }
    throw error;
  }
}
