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

import { isSetString } from "@stryke/type-checks/is-set-string";
import type { FileReferenceInput } from "@stryke/types/configuration";
import { isValidURL } from "@stryke/url/helpers";
import { isFileReference } from "./type-checks";
import type { GitHubReference, GitLabReference } from "./types";

/**
 * Extracts the file path from a {@link FileReferenceInput} value.
 *
 * @remarks
 * A {@link FileReferenceInput} can be either a {@link FileReference} object or a string that includes both a path to the TypeScript module and the name of the module export separated by a ":", "#", or ";" character. This function extracts the file path from either type of input.
 *
 * @param input - The {@link FileReferenceInput} value to extract the file path from.
 * @returns The extracted file path as a string.
 * @throws If the input is not a valid {@link FileReferenceInput}.
 */
export function extractFilePath(input: FileReferenceInput): string {
  if (!isFileReference(input) && !isSetString(input)) {
    throw new TypeError(
      `Expected a file reference input, but received: ${typeof input}`
    );
  }

  if (isFileReference(input)) {
    return input.file;
  }

  let file!: string;
  const separatorIndex = Math.max(
    input.lastIndexOf(":"),
    input.lastIndexOf("#"),
    input.lastIndexOf(";")
  );

  if (separatorIndex >= 0) {
    file = input.slice(0, separatorIndex);
  } else {
    file = input;
  }

  return file;
}

export interface ExtractedRepositoryReference {
  owner: string;
  repo: string;
  branch: string;
  filePath?: string;
}

/**
 * Extracts information from a GitHub repository reference string.
 *
 * @remarks
 * A GitHub repository reference string, starting with either `"github:"` or `"gh:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"github:main:storm-software/stryke/packages/base/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"github:storm-software/stryke/packages/resolve/src/types.ts@main"`).
 *
 * @param input - The {@link GitHubReference} string to extract information from.
 * @returns An {@link ExtractedRepositoryReference} object containing the extracted information.
 */
export function extractGitHubReference(
  input: GitHubReference
): ExtractedRepositoryReference {
  const value = input.trim();
  const prefix = value.toLowerCase().startsWith("github:")
    ? "github:"
    : value.toLowerCase().startsWith("gh:")
      ? "gh:"
      : undefined;

  if (!prefix) {
    throw new Error(
      `The provided input "${input}" is not a valid GitHub reference. Please use the "github:" or "gh:" prefix.`
    );
  }

  let payload = value.slice(prefix.length).trim();
  if (!payload) {
    throw new Error(
      `The provided input "${input}" is missing repository information. Please provide an owner, repository, and file path.`
    );
  }

  let branch: string | undefined;

  const payloadIsURL = isValidURL(payload);

  // Support refs like github:owner/repo/path/to/file@main.
  if (!payloadIsURL) {
    const atIndex = payload.lastIndexOf("@");
    if (atIndex > 0 && atIndex < payload.length - 1) {
      branch = payload.slice(atIndex + 1).trim();
      payload = payload.slice(0, atIndex).trim();
    }
  }

  // Support refs like github:main:owner/repo/path/to/file.
  if (!payloadIsURL) {
    const colonIndex = payload.indexOf(":");
    if (
      !branch &&
      colonIndex > 0 &&
      payload.slice(colonIndex + 1).includes("/")
    ) {
      const candidate = payload.slice(0, colonIndex).trim();
      const remainder = payload.slice(colonIndex + 1).trim();
      if (candidate && remainder) {
        branch = candidate;
        payload = remainder;
      }
    }
  }

  const defaultBranch = "main";
  let owner!: string;
  let repo!: string;
  let filePath!: string;

  if (isValidURL(payload)) {
    const url = new URL(payload);
    const segments = url.pathname
      .split("/")
      .map(segment => segment.trim())
      .filter(Boolean);

    if (url.hostname === "raw.githubusercontent.com") {
      if (segments.length < 4) {
        throw new Error(
          `The provided input "${input}" does not include a valid GitHub raw file path.`
        );
      }

      owner = segments[0]!;
      repo = segments[1]!;
      branch ??= segments[2]!;
      filePath = segments.slice(3).join("/");
    } else if (url.hostname === "github.com") {
      if (segments.length < 2) {
        throw new Error(
          `The provided input "${input}" does not include a valid GitHub repository path.`
        );
      }

      owner = segments[0]!;
      repo = segments[1]!;

      if ((segments[2] === "blob" || segments[2] === "raw") && segments[3]) {
        branch ??= segments[3];
        filePath = segments.slice(4).join("/");
      } else {
        filePath = segments.slice(2).join("/");
      }
    } else {
      throw new Error(
        `The provided input "${input}" is not a supported GitHub URL. Please use a github.com or raw.githubusercontent.com URL.`
      );
    }
  } else {
    const segments = payload
      .split("/")
      .map(segment => segment.trim())
      .filter(Boolean);

    if (segments.length < 3) {
      throw new Error(
        `The provided input "${input}" must include owner, repository, and file path.`
      );
    }

    owner = segments[0]!;
    repo = segments[1]!;

    if ((segments[2] === "blob" || segments[2] === "raw") && segments[3]) {
      branch ??= segments[3];
      filePath = segments.slice(4).join("/");
    } else {
      filePath = segments.slice(2).join("/");
    }
  }

  if (!filePath) {
    throw new Error(
      `The provided input "${input}" does not include a valid file path in the GitHub repository.`
    );
  }

  return {
    owner,
    repo,
    branch: branch ?? defaultBranch,
    filePath
  };
}

/**
 * Extracts information about a file in a GitLab repository via a {@link GitLabReference} string.
 *
 * @remarks
 * A GitLab repository reference string, starting with either `"gitlab:"` or `"gl:"`, an optional branch or tag, and optionally including a specific file path within the repository (for example: `"gitlab:master:storm-software/stryke/packages/resolve/src/types.ts"`). It is also valid to provide the branch or tag after the file path (for example: `"gitlab:storm-software/stryke/packages/resolve/src/types.ts@master"`).
 *
 * @param input - The {@link GitLabReference} string to extract information from.
 * @returns An object containing the extracted repository information.
 */
export function extractGitLabReference(
  input: GitLabReference
): ExtractedRepositoryReference {
  const value = input.trim();
  const prefix = value.toLowerCase().startsWith("gitlab:")
    ? "gitlab:"
    : value.toLowerCase().startsWith("gl:")
      ? "gl:"
      : undefined;

  if (!prefix) {
    throw new Error(
      `The provided input "${input}" is not a valid GitLab reference. Please use the "gitlab:" or "gl:" prefix.`
    );
  }

  let payload = value.slice(prefix.length).trim();
  if (!payload) {
    throw new Error(
      `The provided input "${input}" is missing repository information. Please provide an owner, repository, and file path.`
    );
  }

  let branch: string | undefined;

  const payloadIsURL = isValidURL(payload);

  // Support refs like gitlab:owner/repo/path/to/file@master.
  if (!payloadIsURL) {
    const atIndex = payload.lastIndexOf("@");
    if (atIndex > 0 && atIndex < payload.length - 1) {
      branch = payload.slice(atIndex + 1).trim();
      payload = payload.slice(0, atIndex).trim();
    }
  }

  // Support refs like gitlab:master:owner/repo/path/to/file.
  if (!payloadIsURL) {
    const colonIndex = payload.indexOf(":");
    if (
      !branch &&
      colonIndex > 0 &&
      payload.slice(colonIndex + 1).includes("/")
    ) {
      const candidate = payload.slice(0, colonIndex).trim();
      const remainder = payload.slice(colonIndex + 1).trim();
      if (candidate && remainder) {
        branch = candidate;
        payload = remainder;
      }
    }
  }

  const defaultBranch = "master";
  let owner!: string;
  let repo!: string;
  let filePath!: string;

  if (isValidURL(payload)) {
    const url = new URL(payload);
    const segments = url.pathname
      .split("/")
      .map(segment => segment.trim())
      .filter(Boolean);

    if (url.hostname === "gitlab.com") {
      if (segments.length < 4) {
        throw new Error(
          `The provided input "${input}" does not include a valid GitLab file path.`
        );
      }

      owner = segments[0]!;
      repo = segments[1]!;
      branch ??= segments[3]!;
      filePath = segments.slice(4).join("/");
    } else {
      throw new Error(
        `The provided input "${input}" is not a supported GitLab URL. Please use a gitlab.com URL.`
      );
    }
  } else {
    const segments = payload
      .split("/")
      .map(segment => segment.trim())
      .filter(Boolean);

    if (segments.length < 3) {
      throw new Error(
        `The provided input "${input}" must include owner, repository, and file path.`
      );
    }

    owner = segments[0]!;
    repo = segments[1]!;

    if ((segments[2] === "blob" || segments[2] === "raw") && segments[3]) {
      branch ??= segments[3];
      filePath = segments.slice(4).join("/");
    } else {
      filePath = segments.slice(2).join("/");
    }
  }

  if (!filePath) {
    throw new Error(
      `The provided input "${input}" does not include a valid file path in the GitLab repository.`
    );
  }

  return {
    owner,
    repo,
    branch: branch ?? defaultBranch,
    filePath
  };
}
