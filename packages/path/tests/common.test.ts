import { describe, expect, it } from "vitest";
import { commonPath, findBasePath } from "../src/common.ts";

describe("common.ts", () => {
  it("finds the common path for multiple paths", () => {
    expect(
      commonPath(["/foo/bar/baz", "/foo/bar/qux", "/foo/bar/baz/quux"])
    ).toBe("/foo/bar");
  });

  it("returns the only path when a single path is provided", () => {
    expect(commonPath(["/foo/bar/baz"])).toBe("/foo/bar/baz");
  });

  it("returns the base path for a string input", () => {
    expect(findBasePath("/foo/bar/baz")).toBe("/foo/bar/baz");
  });

  it("strips glob stars before resolving the base path", () => {
    expect(findBasePath(["foo/bar/**/baz", "foo/bar/qux/*", "foo/bar/baz/quux"])).toBe(
      "foo/bar"
    );
  });

  it("falls back to the root path for empty input", () => {
    expect(findBasePath([])).toBe("/");
  });
});
