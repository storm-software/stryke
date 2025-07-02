/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/* eslint-disable ts/naming-convention */

type EnvObject = Record<string, string | undefined>;

declare global {
  let EdgeRuntime: undefined | unknown;
  let Netlify: undefined | unknown;
  let fastly: undefined | unknown;
  let Bun: undefined | unknown;

  let process: Record<string, any> & {
    env: EnvObject;
    versions: {
      node?: string;
      deno?: string;
      bun?: string;
      edgeRuntime?: string;
    };
    platform?: string;
    arch?: string;
  };
  let navigator: undefined | { userAgent: string };

  let __env__: undefined | EnvObject;

  let Deno:
    | undefined
    | { env: { toObject: () => EnvObject; [key: string]: unknown } };

  interface ImportMeta {
    env: EnvObject;
  }
}

export {};
