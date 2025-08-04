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

/* eslint-disable ts/naming-convention */

type EnvObject = Record<string, string | undefined>;

declare const EdgeRuntime: undefined | unknown;
declare const Netlify: undefined | unknown;
declare const fastly: undefined | unknown;
declare const Bun: undefined | unknown;
declare const Deno:
  | undefined
  | { env: { toObject: () => EnvObject; [key: string]: unknown } };

declare const navigator: undefined | { userAgent: string };

declare global {
  const EdgeRuntime: undefined | unknown;
  const Netlify: undefined | unknown;
  const fastly: undefined | unknown;
  const Bun: undefined | unknown;
  declare const Deno:
    | undefined
    | { env: { toObject: () => EnvObject; [key: string]: unknown } };

  const process: Record<string, any> & {
    env: EnvObject;
    versions: {
      node?: string;
      deno?: string;
      bun?: string;
      edgeRuntime?: string;
      webcontainer?: string;
      netlify?: string;
    };
    platform?: string;
    arch?: string;
  };
  const navigator: undefined | { userAgent: string };

  const __env__: undefined | EnvObject;

  const Deno:
    | undefined
    | { env: { toObject: () => EnvObject; [key: string]: unknown } };

  interface ImportMeta {
    env: EnvObject;
  }
}
