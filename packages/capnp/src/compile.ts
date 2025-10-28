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

import { writeWarning } from "@storm-software/config-tools/logger/console";
import { existsSync } from "@stryke/fs/exists";
import { compileAll } from "capnp-es/compiler";
import defu from "defu";
import { Buffer } from "node:buffer";
import { exec } from "node:child_process";
import { resolveOptions } from "./helpers.js";
import type {
  CapnpcOptions,
  CapnpcResolvedOptions,
  CapnpcResult
} from "./types.js";

/**
 * Compiles Cap'n Proto schemas into TypeScript files.
 *
 * @param options - The options for the compilation process.
 * @returns A promise that resolves to the compilation result.
 */
export async function capnpc(
  options: CapnpcResolvedOptions
): Promise<CapnpcResult> {
  const { output, tsconfig, schemas = [], tty } = options;

  let dataBuf: Buffer = Buffer.alloc(0);
  if (tty) {
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

    if (output && existsSync(output)) {
      opts.push(`-o-:${output}`);
    } else {
      if (output && !existsSync(output)) {
        writeWarning(
          `Output directory "${output}" does not exist, will write to schema path...`
        );
      }

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

  return compileAll(dataBuf, {
    ts: options.ts ?? true,
    js: false,
    dts: false,
    tsconfig: tsconfig.options
  });
}

/**
 * Compiles Cap'n Proto schemas into TypeScript files.
 *
 * @param dataBuf - The buffer containing the Cap'n Proto schema data.
 * @param options - The options for the compilation process.
 * @returns A promise that resolves to the compilation result.
 */
export async function compile(dataBuf: Buffer, options: CapnpcOptions) {
  const resolvedOptions = await resolveOptions(
    options as Parameters<typeof resolveOptions>[0]
  );
  if (!resolvedOptions) {
    writeWarning(
      "✖ Unable to resolve Cap'n Proto compiler options - the program will terminate",
      { logLevel: "all" }
    );
    return;
  }

  return compileAll(
    dataBuf,
    defu(
      {
        tsconfig: resolvedOptions.tsconfig.options
      },
      resolvedOptions,
      {
        ts: true,
        js: false,
        dts: false
      }
    )
  );
}
