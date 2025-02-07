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

import {
  createNodesFromFiles,
  type CreateNodesResultV2,
  type CreateNodesV2,
  readJsonFile
} from "@nx/devkit/index.js";
import {
  getProjectConfigFromProjectRoot,
  getProjectRoot
} from "@storm-software/workspace-tools/utils/plugin-helpers";
import {
  getProjectTag,
  ProjectTagConstants,
  setDefaultProjectTags
} from "@storm-software/workspace-tools/utils/project-tags";
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
          console.log(`Processing project.json file: ${configFile}`);

          const projectRoot = getProjectRoot(configFile, context.workspaceRoot);
          if (!projectRoot) {
            console.error(
              `project.json file must be location in the project root directory: ${configFile}`
            );
            return {};
          }

          const tsconfigJson = readJsonFile(join(projectRoot, "tsconfig.json"));
          if (!tsconfigJson) {
            console.error(
              `No tsconfig.json found in project root: ${projectRoot}`
            );
            return {};
          }

          const packageJson = readJsonFile(join(projectRoot, "package.json"));
          if (!packageJson) {
            console.error(
              `No package.json found in project root: ${projectRoot}`
            );
            return {};
          }

          const project = getProjectConfigFromProjectRoot(
            projectRoot,
            packageJson
          );

          const platformTag = getProjectTag(
            project,
            ProjectTagConstants.Platform.TAG_ID
          );

          const nxJson = readNxJson(context.workspaceRoot);
          const targets: ProjectConfiguration["targets"] =
            readTargetsFromPackageJson(packageJson, nxJson);

          targets.build ??= {
            cache: true,
            inputs: ["typescript", "^production"],
            outputs: ["{workspaceRoot}/dist/{projectRoot}"],
            executor: "@storm-software/workspace-tools:unbuild",
            dependsOn: ["^build"],
            defaultConfiguration: "production",
            options: {
              platform:
                platformTag === "worker" ? "browser" : platformTag || "neutral"
            },
            configurations: {
              production: {
                debug: false
              },
              development: {
                debug: true
              }
            }
          };

          let relativeRoot = projectRoot
            .replaceAll("\\", "/")
            .replace(context.workspaceRoot.replaceAll("\\", "/"), "");
          if (relativeRoot.startsWith("/")) {
            relativeRoot = relativeRoot.slice(1);
          }

          targets.clean = {
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
          console.log(`Writing Results for ${project?.name ?? "missing name"}`);
          console.log(result);

          return result;
        } catch (error_) {
          console.error(error_);
          return {};
        }
      },
      configFiles,
      options,
      context
    );
  }
];
