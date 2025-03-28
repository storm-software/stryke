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

// https://runtime-keys.proposal.wintercg.org/
export type RuntimeName =
  | "workerd"
  | "deno"
  | "netlify"
  | "node"
  | "bun"
  | "edge-light"
  | "fastly"
  | "";

export interface RuntimeInfo {
  name: RuntimeName;
}

/**
 * Indicates if running in Node.js or a Node.js compatible runtime.
 *
 * **Note:** When running code in Bun and Deno with Node.js compatibility mode, `isNode` flag will be also `true`, indicating running in a Node.js compatible runtime.
 *
 * Use `runtime === "node"` if you need strict check for Node.js runtime.
 */
export const isNode = globalThis.process?.release?.name === "node";

/**
 * Indicates if running in Bun runtime.
 */
export const isBun =
  Boolean(globalThis.Bun) || Boolean(globalThis.process?.versions?.bun);

/**
 * Indicates if running in Deno runtime.
 */
export const isDeno = Boolean(globalThis.Deno);

/**
 * Indicates if running in Fastly runtime.
 */
export const isFastly = Boolean(globalThis.fastly);

/**
 * Indicates if running in Netlify runtime.
 */
export const isNetlify = Boolean(globalThis.Netlify);

/**
 *
 * Indicates if running in EdgeLight (Vercel Edge) runtime.
 */
export const isEdgeLight = Boolean(globalThis.EdgeRuntime);
// https://developers.cloudflare.com/workers/runtime-apis/web-standards/#navigatoruseragent

/**
 * Indicates if running in Cloudflare Workers runtime.
 */
export const isWorkerd =
  globalThis.navigator?.userAgent === "Cloudflare-Workers";

/**
 * Indicates if the code is running on the server-side
 */
export const isRuntimeServer =
  isNode ||
  isBun ||
  isDeno ||
  isFastly ||
  isNetlify ||
  isEdgeLight ||
  isWorkerd;

/**
 * Indicates if the code is running in the browser (and not on the server).
 */
export const isRuntimeClient = !isRuntimeServer;

const runtimeChecks: [boolean, RuntimeName][] = [
  [isNetlify, "netlify"],
  [isEdgeLight, "edge-light"],
  [isWorkerd, "workerd"],
  [isFastly, "fastly"],
  [isDeno, "deno"],
  [isBun, "bun"],
  [isNode, "node"]
];

function detectRuntime(): RuntimeInfo | undefined {
  const detectedRuntime = runtimeChecks.find(check => check[0]);

  if (detectedRuntime) {
    const name = detectedRuntime[1];

    return { name };
  }

  return undefined;
}

export const runtimeInfo = detectRuntime();

export const runtime: RuntimeName = runtimeInfo?.name || "";
