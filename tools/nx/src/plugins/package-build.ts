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

import type { CreateNodesResultV2, CreateNodesV2 } from "@nx/devkit/index.js";
import { createNodesFromFiles, readJsonFile } from "@nx/devkit/index.js";
import {
  getProjectConfigFromProjectRoot,
  getProjectRoot
} from "@storm-software/workspace-tools/utils/plugin-helpers";
import { setDefaultProjectTags } from "@storm-software/workspace-tools/utils/project-tags";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json.js";
import { readTargetsFromPackageJson } from "nx/src/utils/package-json.js";

/* eslint-disable no-console */

export const name = "stryke/package-build";

export interface StrykePackageBuildPluginOptions {}

export const createNodesV2: CreateNodesV2<StrykePackageBuildPluginOptions> = [
  "packages/*/project.json",
  async (configFiles, options, context): Promise<CreateNodesResultV2> => {
    return createNodesFromFiles(
      (configFile, options, context) => {
        try {
          console.log(`[${name}]: Processing project.json file: ${configFile}`);

          const projectRoot = getProjectRoot(configFile, context.workspaceRoot);
          if (!projectRoot) {
            console.error(
              `[${name}]: project.json file must be location in the project root directory: ${configFile}`
            );
            return {};
          }

          const tsconfigJson = readJsonFile(join(projectRoot, "tsconfig.json"));
          if (!tsconfigJson) {
            console.error(
              `[${name}]: No tsconfig.json found in project root: ${projectRoot}`
            );
            return {};
          }

          const packageJson = readJsonFile(join(projectRoot, "package.json"));
          if (!packageJson) {
            console.error(
              `[${name}]: No package.json found in project root: ${projectRoot}`
            );
            return {};
          }

          const project = getProjectConfigFromProjectRoot(
            projectRoot,
            packageJson
          );

          const nxJson = readNxJson(context.workspaceRoot);
          const targets: ProjectConfiguration["targets"] =
            readTargetsFromPackageJson(
              packageJson,
              nxJson,
              projectRoot,
              context.workspaceRoot
            );

          if (project?.name && !project?.name.startsWith("tools")) {
            if (existsSync(join(projectRoot, "tsdown.config.ts"))) {
              console.log(
                `[${name}]: ${project.name} project at ${projectRoot} contains custom tsdown.config.ts`
              );

              targets.build ??= {
                cache: true,
                inputs: ["typescript", "^production"],
                outputs: ["{workspaceRoot}/dist/{projectRoot}"],
                dependsOn: ["^build"],
                command: `tsdown --config \"${
                  existsSync(join(projectRoot, "tsdown.config.ts"))
                    ? "tsdown.config.ts"
                    : ""
                }\" --cwd \"${join(context.workspaceRoot, projectRoot)}\"`,
                defaultConfiguration: "production",
                options: {
                  cwd: projectRoot,
                  name: project?.name
                },
                configurations: {
                  production: {
                    debug: false,
                    sourcemap: false
                  },
                  development: {
                    debug: true,
                    sourcemap: true
                  }
                }
              };
            } else {
              console.log(
                `[${name}]: ${project.name} project at ${projectRoot} will use default tsdown.config.ts`
              );

              targets["build-base"] ??= {
                cache: true,
                inputs: ["typescript", "^production"],
                outputs: ["{workspaceRoot}/dist/{projectRoot}"],
                command: `tsdown \"src/**/*.ts\" --config \"../../tools/config/tsdown.config.ts\" --cwd \"${join(
                  context.workspaceRoot,
                  projectRoot
                )}\"`,
                defaultConfiguration: "production",
                options: {
                  cwd: projectRoot,
                  name: project?.name
                },
                configurations: {
                  production: {
                    debug: false,
                    sourcemap: false
                  },
                  development: {
                    debug: true,
                    sourcemap: true
                  }
                }
              };

              targets.build ??= {
                cache: true,
                inputs: [
                  "{workspaceRoot}/LICENSE",
                  "{projectRoot}/dist",
                  "{projectRoot}/*.md",
                  "{projectRoot}/package.json"
                ],
                outputs: [`{workspaceRoot}/dist/${projectRoot}`],
                executor: "nx:run-commands",
                dependsOn: ["build-base", "^build"],
                options: {
                  commands: [
                    `pnpm copyfiles LICENSE dist/${projectRoot}`,
                    `pnpm copyfiles --up=2 ./${projectRoot}/*.md ./${
                      projectRoot
                    }/package.json dist/${projectRoot}`,
                    `pnpm copyfiles --up=3 "./${projectRoot}/dist/**/*" dist/${
                      projectRoot
                    }/dist`
                  ]
                }
              };
            }
          }

          let relativeRoot = projectRoot
            .replaceAll("\\", "/")
            .replace(context.workspaceRoot.replaceAll("\\", "/"), "");
          if (relativeRoot.startsWith("/")) {
            relativeRoot = relativeRoot.slice(1);
          }

          targets.clean ??= {
            executor: "nx:run-commands",
            inputs: [
              `{workspaceRoot}/${configFile}`,
              "typescript",
              "^production"
            ],
            outputs: ["{workspaceRoot}/dist/{projectRoot}"],
            options: {
              commands: [
                `pnpm exec rimraf dist/${relativeRoot}`,
                `pnpm exec rimraf ${relativeRoot}/dist`
              ]
            }
          };

          setDefaultProjectTags(project, name);

          const result = project?.name
            ? {
                projects: {
                  [project.name]: {
                    ...project,
                    root: relativeRoot,
                    targets
                  }
                }
              }
            : {};
          console.log(
            `[${name}]: Writing Results for ${project?.name ?? "missing name"}`
          );
          console.log(result);

          return result;
        } catch (err) {
          console.error(err);
          return {};
        }
      },
      configFiles,
      options!,
      context
    );
  }
];
