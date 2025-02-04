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

type NodePath = typeof import("node:path");

/**
 * The platform-specific file delimiter.
 *
 * Equals to `";"` in windows and `":"` in all other platforms.
 */
export const delimiter: ";" | ":" = /* @__PURE__ */ (() =>
  globalThis.process?.platform === "win32" ? ";" : ":")();

// Mix namespaces without side-effects of object to allow tree-shaking

const platforms = {
  posix: undefined,
  win32: undefined
} as unknown as {
  posix: NodePath["posix"];
  win32: NodePath["win32"];
};

const mix = (del: ";" | ":" = delimiter) => {
  return new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === "delimiter") return del;
        if (prop === "posix") return posix;
        if (prop === "win32") return win32;
        return platforms[prop as keyof typeof platforms];
      }
    }
  ) as unknown as NodePath;
};

export const posix = /* @__PURE__ */ mix(":") as NodePath["posix"];

export const win32 = /* @__PURE__ */ mix(";") as NodePath["win32"];
