import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/index";

describe("index.ts exports", () => {
  it("re-exports runtime members from all source modules", () => {
    const expectedExports = [
      "bundle",
      "VALID_OBJECT_SOURCE_EXTENSIONS",
      "extractFilePath",
      "extractGitHubReference",
      "extractGitLabReference",
      "GITHUB_REFERENCE_REGEX",
      "GITLAB_REFERENCE_REGEX",
      "resolveURL",
      "resolveGitHub",
      "resolveGitLab",
      "resolveFilePath",
      "resolve",
      "resolveSafe",
      "isValidObjectSourceFile",
      "isFileReference",
      "isGitHubReference",
      "isGitLabReference",
      "isURLReference",
      "isFileReferenceString",
      "isFileReferenceInput"
    ];

    expect(moduleExports).toBeDefined();

    for (const name of expectedExports) {
      expect(moduleExports).toHaveProperty(name);
    }
  });
});
