import { describe, expect, it } from "vitest";
import { correctPath, stripStars, toAbsolutePath, toRelativePath } from "../src/normalize.ts";

describe("normalize.ts", () => {
  it("re-exports the path normalization helpers", () => {
    expect(correctPath("foo/bar/../baz")).toBe("foo/baz");
    expect(stripStars("src/**/file.ts")).toBe("src");
    expect(toAbsolutePath("src/index.ts", "/home/user/project")).toBe("home/user/project/src/index.ts");
    expect(toRelativePath("/home/user/project/src/index.ts", "/home/user/project")).toBe("home/user/project/src/index.ts");
  });
});
