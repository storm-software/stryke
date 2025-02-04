/*-------------------------------------------------------------------

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

 -------------------------------------------------------------------*/

type EnvObject = Record<string, string | undefined>;

declare global {
  var EdgeRuntime: undefined | unknown;
  var Netlify: undefined | unknown;
  var fastly: undefined | unknown;
  var Bun: undefined | unknown;

  var process: Record<string, any> & {
    env: EnvObject;
  };
  var navigator: undefined | { userAgent: string };

  var __env__: undefined | EnvObject;

  var Deno:
    | undefined
    | { env: { toObject(): EnvObject; [key: string]: unknown } };

  interface ImportMeta {
    env: EnvObject;
  }
}

export {};
