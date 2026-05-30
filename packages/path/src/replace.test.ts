import { describe, expect, it } from "vitest";
import { replaceExtension, replacePath } from "./replace.ts";

describe("replace.ts", () => {
  it("removes the parent path prefix from a child path", () => {
    expect(replacePath("/home/user/project/src/index.ts", "/home/user/project")).toBe("src/index.ts");
  });

  it("replaces file extensions", () => {
    expect(replaceExtension("/home/user/project/src/index.ts", ".js")).toBe("/home/user/project/src/index.js");
    expect(replaceExtension("/home/user/project/src/index.ts")).toBe("/home/user/project/src/index");
  });
});
