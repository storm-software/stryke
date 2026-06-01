import { describe, expect, it } from "vitest";
import { appendPath, correctPath, findBasePath, joinPaths, slash } from "../src/index.ts";

describe("index.ts", () => {
  it("re-exports the core path helpers", () => {
    expect(appendPath("src/index.ts", "/home/user/project")).toBe("/home/user/project/src/index.ts");
    expect(correctPath("foo/bar/../baz")).toBe("foo/baz");
    expect(findBasePath(["foo/bar/**/baz", "foo/bar/qux/*"])).toBe("foo/bar");
    expect(joinPaths("folder1", "folder2", "..", "folder3", "file.txt")).toBe("folder1/folder3/file.txt");
    expect(slash("foo\\bar")).toBe("foo/bar");
  });
});
