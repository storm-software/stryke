#!/usr/bin/env node
/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

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

import { existsSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies"
];

function findWorkspaceRoot(startDir) {
  let current = resolve(startDir);
  while (true) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      return undefined;
    }
    current = parent;
  }
}

async function getWorkspacePackageRoots(workspaceRoot) {
  const roots = [];

  for (const parentName of ["packages", "tools"]) {
    const parentDir = join(workspaceRoot, parentName);
    if (!existsSync(parentDir)) {
      continue;
    }

    for (const entry of await readdir(parentDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const packageRoot = join(parentDir, entry.name);
      if (existsSync(join(packageRoot, "package.json"))) {
        roots.push(packageRoot);
      }
    }
  }

  return roots;
}

async function getPrivateWorkspacePackageNames(workspaceRoot) {
  const privatePackages = new Set();

  for (const packageRoot of await getWorkspacePackageRoots(workspaceRoot)) {
    const packageJson = JSON.parse(
      await readFile(join(packageRoot, "package.json"), "utf8")
    );
    if (packageJson.private === true && packageJson.name) {
      privatePackages.add(packageJson.name);
    }
  }

  return privatePackages;
}

function stripPrivateWorkspaceDeps(packageJson, privatePackages) {
  const removed = [];

  for (const field of DEP_FIELDS) {
    const deps = packageJson[field];
    if (!deps || typeof deps !== "object") {
      continue;
    }

    for (const [name, version] of Object.entries(deps)) {
      if (
        typeof version === "string" &&
        version.startsWith("workspace:") &&
        privatePackages.has(name)
      ) {
        delete deps[name];
        removed.push(`${field}.${name}`);
      }
    }

    if (Object.keys(deps).length === 0) {
      delete packageJson[field];
    }
  }

  return removed;
}

async function main() {
  const packageJsonPath = process.argv[2];
  if (!packageJsonPath) {
    throw new Error("Usage: prepare-package-json.mjs <path-to-package.json>");
  }

  const absolutePackageJsonPath = resolve(packageJsonPath);
  if (!existsSync(absolutePackageJsonPath)) {
    throw new Error(`package.json not found at ${absolutePackageJsonPath}`);
  }

  const workspaceRoot =
    findWorkspaceRoot(dirname(absolutePackageJsonPath)) ??
    findWorkspaceRoot(dirname(fileURLToPath(import.meta.url)));
  if (!workspaceRoot) {
    throw new Error("Unable to locate workspace root (pnpm-workspace.yaml)");
  }

  const packageJson = JSON.parse(
    await readFile(absolutePackageJsonPath, "utf8")
  );
  const privatePackages = await getPrivateWorkspacePackageNames(workspaceRoot);
  const removed = stripPrivateWorkspaceDeps(packageJson, privatePackages);

  await writeFile(
    absolutePackageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8"
  );

  if (removed.length > 0) {
    console.log(
      `Removed private workspace dependencies from ${absolutePackageJsonPath}: ${removed.join(", ")}`
    );
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
