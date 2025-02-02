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

export type PackageManagers = "npm" | "yarn" | "pnpm" | "bun";
export const PackageManagers = {
  NPM: "npm" as PackageManagers,
  YARN: "yarn" as PackageManagers,
  PNPM: "pnpm" as PackageManagers,
  BUN: "bun" as PackageManagers
};

export type PackageManagerLockFiles =
  | "package-lock.json"
  | "yarn.lock"
  | "pnpm-lock.yaml"
  | "bun.lock";
export const PackageManagerLockFiles = {
  NPM: "package-lock.json" as PackageManagerLockFiles,
  YARN: "yarn.lock" as PackageManagerLockFiles,
  PNPM: "pnpm-lock.yaml" as PackageManagerLockFiles,
  BUN: "bun.lock" as PackageManagerLockFiles
};
