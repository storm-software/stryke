import { describe, expect, it } from "vitest";
import {
  correctPath,
  normalizeWindowsPath,
  stripStars,
  toAbsolutePath,
  toRelativePath,
  withTrailingSlash,
  withoutTrailingSlash
} from "./correct-path.ts";

describe("correct-path.ts", () => {
  it("normalizes Windows path separators and drive letters", () => {
    expect(normalizeWindowsPath("c:\\repo\\stryke\\src")).toBe("C:/repo/stryke/src");
  });

  it("returns dot for empty paths", () => {
    expect(correctPath("")).toBe(".");
  });

  it("normalizes relative parent segments", () => {
    expect(correctPath("foo/bar/../baz")).toBe("foo/baz");
  });

  it("removes glob stars from paths", () => {
    expect(stripStars("src/**/file.ts")).toBe("src");
  });

  it("converts relative paths to absolute paths", () => {
    expect(toAbsolutePath("src/index.ts", "/home/user/project")).toBe("home/user/project/src/index.ts");
  });

  it("converts absolute paths to relative paths from cwd", () => {
    expect(toRelativePath("/home/user/project/src/index.ts", "/home/user/project")).toBe("home/user/project/src/index.ts");
  });

  it("adds and removes trailing slashes", () => {
    expect(withTrailingSlash("/home/user/project")).toBe("/home/user/project/");
    expect(withoutTrailingSlash("/home/user/project/")).toBe("/home/user/project");
  });
});
