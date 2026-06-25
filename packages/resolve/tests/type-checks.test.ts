import { describe, expect, it } from "vitest";
import {
  isFileReference,
  isFileReferenceInput,
  isFileReferenceString,
  isGitHubReference,
  isGitLabReference,
  isURLReference,
  isValidObjectSourceFile
} from "../src/type-checks";

describe("isValidObjectSourceFile", () => {
  it("returns true for known valid source extensions", () => {
    expect(isValidObjectSourceFile("index.ts")).toBe(true);
    expect(isValidObjectSourceFile("config.json")).toBe(true);
  });

  it("returns false for unsupported extensions", () => {
    expect(isValidObjectSourceFile("README.md")).toBe(false);
  });
});

describe("isFileReference", () => {
  it("returns true for object values with a file property", () => {
    expect(isFileReference({ file: "./src/index.ts" })).toBe(true);
  });

  it("returns false for plain strings", () => {
    expect(isFileReference("./src/index.ts")).toBe(false);
  });
});

describe("isGitHubReference", () => {
  it("identifies valid GitHub reference strings", () => {
    expect(isGitHubReference("github:main:owner/repo/path/to/file.ts")).toBe(
      true
    );
    expect(isGitHubReference("gh:owner/repo/path/to/file.ts@feature")).toBe(
      true
    );
  });

  it("rejects non-GitHub references", () => {
    expect(isGitHubReference("gitlab:owner/repo/file.ts" as any)).toBe(false);
  });
});

describe("isGitLabReference", () => {
  it("identifies valid GitLab reference strings", () => {
    expect(isGitLabReference("gitlab:master:owner/repo/path/to/file.ts")).toBe(
      true
    );
    expect(isGitLabReference("gl:owner/repo/path/to/file.ts@feature")).toBe(
      true
    );
  });

  it("rejects non-GitLab references", () => {
    expect(isGitLabReference("github:owner/repo/file.ts" as any)).toBe(false);
  });
});

describe("isURLReference", () => {
  it("accepts URL and repository references", () => {
    expect(isURLReference("https://example.com/config.ts")).toBe(true);
    expect(isURLReference("github:main:owner/repo/path/to/file.ts")).toBe(true);
    expect(isURLReference("gitlab:master:owner/repo/path/to/file.ts")).toBe(
      true
    );
  });

  it("rejects non-URL references", () => {
    expect(isURLReference("not-a-reference")).toBe(false);
  });
});

describe("isFileReferenceString", () => {
  it("accepts URL and repository based reference strings", () => {
    expect(isFileReferenceString("https://example.com/config.ts#default")).toBe(
      true
    );
    expect(
      isFileReferenceString("github:main:owner/repo/path/to/file.ts")
    ).toBe(false);
  });

  it("rejects unsupported values", () => {
    expect(isFileReferenceString(123 as any)).toBe(false);
    expect(isFileReferenceString("not-a-reference")).toBe(true);
  });
});

describe("isFileReferenceInput", () => {
  it("accepts object file references and file reference strings", () => {
    expect(isFileReferenceInput({ file: "./src/index.ts" })).toBe(true);
    expect(isFileReferenceInput("https://example.com/config.ts")).toBe(true);
  });

  it("rejects invalid inputs", () => {
    expect(isFileReferenceInput({})).toBe(false);
    expect(() => isFileReferenceInput(null)).toThrow(TypeError);
  });
});
