import { describe, expect, it } from "vitest";
import { formatSlash, slash } from "./slash.ts";

describe("slash.ts", () => {
  it("replaces backslashes with forward slashes", () => {
    expect(slash("foo\\bar\\baz")).toBe("foo/bar/baz");
  });

  it("keeps UNC-prefixed paths unchanged", () => {
    expect(slash("\\\\?\\C:\\repo\\file.ts")).toBe("\\\\?\\C:\\repo\\file.ts");
  });

  it("removes trailing slash noise for relative paths", () => {
    expect(formatSlash("./foo/bar/")).toBe("foo/bar");
  });

  it("preserves absolute paths while trimming trailing slashes", () => {
    expect(formatSlash("/foo/bar/")).toBe("/foo/bar");
  });
});
