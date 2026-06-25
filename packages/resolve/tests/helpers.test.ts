import { describe, expect, expectTypeOf, it } from "vitest";
import {
  extractFilePath,
  extractGitHubReference,
  extractGitLabReference,
  type ExtractedRepositoryReference
} from "../src/helpers";

describe("extractFilePath", () => {
  it("returns file from a file reference object", () => {
    expect(extractFilePath({ file: "./src/index.ts" })).toBe("./src/index.ts");
  });

  it("extracts path before export separators in a string reference", () => {
    expect(extractFilePath("./src/index.ts:myExport")).toBe("./src/index.ts");
    expect(extractFilePath("./src/index.ts#myExport")).toBe("./src/index.ts");
    expect(extractFilePath("./src/index.ts;myExport")).toBe("./src/index.ts");
  });

  it("returns the raw input when no separator exists", () => {
    expect(extractFilePath("./src/index.ts")).toBe("./src/index.ts");
  });

  it("throws for invalid input", () => {
    expect(() => extractFilePath(42 as any)).toThrow(TypeError);
  });
});

describe("extractGitHubReference", () => {
  it("parses branch-first shorthand references", () => {
    expect(
      extractGitHubReference(
        "github:main:storm-software/stryke/packages/resolve/src/types.ts"
      )
    ).toEqual({
      owner: "storm-software",
      repo: "stryke",
      branch: "main",
      filePath: "packages/resolve/src/types.ts"
    });
  });

  it("parses @branch shorthand references", () => {
    expect(
      extractGitHubReference(
        "gh:storm-software/stryke/packages/resolve/src/types.ts@dev"
      )
    ).toEqual({
      owner: "storm-software",
      repo: "stryke",
      branch: "dev",
      filePath: "packages/resolve/src/types.ts"
    });
  });

  it("parses github.com blob URLs", () => {
    expect(
      extractGitHubReference(
        "github:https://github.com/storm-software/stryke/blob/main/packages/resolve/src/types.ts"
      )
    ).toEqual({
      owner: "storm-software",
      repo: "stryke",
      branch: "main",
      filePath: "packages/resolve/src/types.ts"
    });
  });

  it("throws for non-github references", () => {
    expect(() =>
      extractGitHubReference("gitlab:owner/repo/file.ts" as any)
    ).toThrow("is not a valid GitHub reference");
  });
});

describe("extractGitLabReference", () => {
  it("parses branch-first shorthand references", () => {
    expect(
      extractGitLabReference(
        "gitlab:master:storm-software/stryke/packages/resolve/src/types.ts"
      )
    ).toEqual({
      owner: "storm-software",
      repo: "stryke",
      branch: "master",
      filePath: "packages/resolve/src/types.ts"
    });
  });

  it("parses @branch shorthand references", () => {
    expect(
      extractGitLabReference(
        "gl:storm-software/stryke/packages/resolve/src/types.ts@feature"
      )
    ).toEqual({
      owner: "storm-software",
      repo: "stryke",
      branch: "feature",
      filePath: "packages/resolve/src/types.ts"
    });
  });

  it("parses gitlab.com URLs", () => {
    expect(
      extractGitLabReference(
        "gitlab:https://gitlab.com/storm-software/stryke/-/blob/main/packages/resolve/src/types.ts"
      )
    ).toEqual({
      owner: "storm-software",
      repo: "stryke",
      branch: "blob",
      filePath: "main/packages/resolve/src/types.ts"
    });
  });

  it("throws for non-gitlab references", () => {
    expect(() =>
      extractGitLabReference("github:owner/repo/file.ts" as any)
    ).toThrow("is not a valid GitLab reference");
  });
});

describe("ExtractedRepositoryReference type", () => {
  it("matches the expected shape", () => {
    expectTypeOf<ExtractedRepositoryReference>().toMatchObjectType<{
      owner: string;
      repo: string;
      branch: string;
      filePath?: string;
    }>();
  });
});
