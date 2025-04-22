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

type EnvObject = Record<string, string | undefined>;

declare global {
  let EdgeRuntime: undefined | unknown;
  let Netlify: undefined | unknown;
  let fastly: undefined | unknown;
  let Bun: undefined | unknown;

  let process: Record<string, any> & {
    env: EnvObject;
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
