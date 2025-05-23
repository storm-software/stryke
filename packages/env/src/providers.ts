/* -------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/projects/stryke/license.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://stormsoftware.com/projects/stryke/docs
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

// Reference: https://github.com/watson/ci-info/blob/v3.2.0/vendors.json

export type ProviderName =
  | ""
  | "appveyor"
  | "aws_amplify"
  | "azure_pipelines"
  | "azure_static"
  | "appcircle"
  | "bamboo"
  | "bitbucket"
  | "bitrise"
  | "buddy"
  | "buildkite"
  | "circle"
  | "cirrus"
  | "cloudflare_pages"
  | "codebuild"
  | "codefresh"
  | "drone"
  | "drone"
  | "dsari"
  | "github_actions"
  | "gitlab"
  | "gocd"
  | "layerci"
  | "hudson"
  | "jenkins"
  | "magnum"
  | "netlify"
  | "nevercode"
  | "render"
  | "sail"
  | "semaphore"
  | "screwdriver"
  | "shippable"
  | "solano"
  | "strider"
  | "teamcity"
  | "travis"
  | "vercel"
  | "appcenter"
  | "codesandbox"
  | "stackblitz"
  | "stormkit"
  | "cleavr"
  | "zeabur"
  | "codesphere"
  | "railway"
  | "deno-deploy"
  | "firebase_app_hosting";

type InternalProvider = [
  providerName: Uppercase<ProviderName>,
  envName?: string,
  meta?: Record<string, any>
];

const providers: InternalProvider[] = [
  ["APPVEYOR"],
  ["AWS_AMPLIFY", "AWS_APP_ID", { ci: true }],
  ["AZURE_PIPELINES", "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],
  ["AZURE_STATIC", "INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],
  ["APPCIRCLE", "AC_APPCIRCLE"],
  ["BAMBOO", "bamboo_planKey"],
  ["BITBUCKET", "BITBUCKET_COMMIT"],
  ["BITRISE", "BITRISE_IO"],
  ["BUDDY", "BUDDY_WORKSPACE_ID"],
  ["BUILDKITE"],
  ["CIRCLE", "CIRCLECI"],
  ["CIRRUS", "CIRRUS_CI"],
  ["CLOUDFLARE_PAGES", "CF_PAGES", { ci: true }],
  ["CODEBUILD", "CODEBUILD_BUILD_ARN"],
  ["CODEFRESH", "CF_BUILD_ID"],
  ["DRONE"],
  ["DRONE", "DRONE_BUILD_EVENT"],
  ["DSARI"],
  ["GITHUB_ACTIONS"],
  ["GITLAB", "GITLAB_CI"],
  ["GITLAB", "CI_MERGE_REQUEST_ID"],
  ["GOCD", "GO_PIPELINE_LABEL"],
  ["LAYERCI"],
  ["HUDSON", "HUDSON_URL"],
  ["JENKINS", "JENKINS_URL"],
  ["MAGNUM"],
  ["NETLIFY"],
  ["NETLIFY", "NETLIFY_LOCAL", { ci: false }],
  ["NEVERCODE"],
  ["RENDER"],
  ["SAIL", "SAILCI"],
  ["SEMAPHORE"],
  ["SCREWDRIVER"],
  ["SHIPPABLE"],
  ["SOLANO", "TDDIUM"],
  ["STRIDER"],
  ["TEAMCITY", "TEAMCITY_VERSION"],
  ["TRAVIS"],
  ["VERCEL", "NOW_BUILDER"],
  ["VERCEL", "VERCEL", { ci: false }],
  ["VERCEL", "VERCEL_ENV", { ci: false }],
  ["APPCENTER", "APPCENTER_BUILD_ID"],
  ["CODESANDBOX", "CODESANDBOX_SSE", { ci: false }],
  ["STACKBLITZ"],
  ["STORMKIT"],
  ["CLEAVR"],
  ["ZEABUR"],
  ["CODESPHERE", "CODESPHERE_APP_ID", { ci: true }],
  ["RAILWAY", "RAILWAY_PROJECT_ID"],
  ["RAILWAY", "RAILWAY_SERVICE_ID"],
  ["DENO-DEPLOY", "DENO_DEPLOYMENT_ID"],
  ["FIREBASE_APP_HOSTING", "FIREBASE_APP_HOSTING", { ci: true }]
];

export interface ProviderInfo {
  name: ProviderName;
  ci?: boolean;
  [meta: string]: any;
}

function detectProvider(): ProviderInfo {
  // Based on env
  if (process?.env) {
    for (const provider of providers) {
      const envName = provider[1] || provider[0];
      if (process?.env[envName]) {
        return {
          name: provider[0].toLowerCase(),
          ...(provider[2] as any)
        };
      }
    }
  }

  // Stackblitz / Webcontainer
  if (process?.env?.SHELL === "/bin/jsh" && process?.versions?.webcontainer) {
    return {
      name: "stackblitz",
      ci: false
    };
  }

  return {
    name: "",
    ci: false
  };
}

/** Current provider info */
export const providerInfo = detectProvider();
export const provider: ProviderName = providerInfo.name;
