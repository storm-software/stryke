import { describe, expect, it } from "vitest";
import { appendExtension, appendPath } from "../src/append.ts";

describe("append.ts", () => {
  it("prepends the parent path when the child is not already nested", () => {
    expect(appendPath("src/index.ts", "/home/user/project")).toBe("/home/user/project/src/index.ts");
  });

  it("keeps an already nested child path when skipping existing parents", () => {
    expect(appendPath("/home/user/project/src/index.ts", "/home/user/project")).toBe("/home/user/project/src/index.ts");
  });

  it("appends file extensions with a normalized dot prefix", () => {
    expect(appendExtension("/home/user/project/src/index", ".ts")).toBe("/home/user/project/src/index.ts");
  });
});
