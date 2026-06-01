import { describe, expect, it } from "vitest";
import { prettyPath } from "../src/pretty-path.ts";

describe("pretty-path.ts", () => {
  it("removes the file URI prefix", () => {
    expect(prettyPath("file:///home/user/project/src/index.ts")).toBe("/home/user/project/src/index.ts");
  });

  it("can return a relative path", () => {
    expect(prettyPath("file:///home/user/project/src/index.ts", { relative: true, cwd: "/home/user/project" })).toBe("home/user/project/src/index.ts");
  });
});
