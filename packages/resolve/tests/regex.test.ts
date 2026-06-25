import { describe, expect, it } from "vitest";
import { GITHUB_REFERENCE_REGEX, GITLAB_REFERENCE_REGEX } from "../src/regex";

describe("regex exports", () => {
  it("matches valid GitHub references", () => {
    expect(
      GITHUB_REFERENCE_REGEX.test("github:main:owner/repo/path/to/file.ts")
    ).toBe(true);
    expect(
      GITHUB_REFERENCE_REGEX.test("gh:owner/repo/path/to/file.ts@feature")
    ).toBe(true);
  });

  it("rejects invalid GitHub references", () => {
    expect(GITHUB_REFERENCE_REGEX.test("github:owner")).toBe(false);
    expect(GITHUB_REFERENCE_REGEX.test("gitlab:owner/repo/file.ts")).toBe(
      false
    );
  });

  it("matches valid GitLab references", () => {
    expect(
      GITLAB_REFERENCE_REGEX.test("gitlab:master:owner/repo/path/to/file.ts")
    ).toBe(true);
    expect(
      GITLAB_REFERENCE_REGEX.test("gl:owner/repo/path/to/file.ts@feature")
    ).toBe(true);
  });

  it("rejects invalid GitLab references", () => {
    expect(GITLAB_REFERENCE_REGEX.test("gitlab:owner")).toBe(false);
    expect(GITLAB_REFERENCE_REGEX.test("github:owner/repo/file.ts")).toBe(
      false
    );
  });
});
