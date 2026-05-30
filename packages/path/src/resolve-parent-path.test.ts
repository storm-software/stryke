import { describe, expect, it } from "vitest";
import { resolveParentPath } from "./resolve-parent-path.ts";

describe("resolve-parent-path.ts", () => {
  it("resolves one parent directory by default", () => {
    expect(resolveParentPath("/home/user/project/src/index.ts")).toBe("/home/user/project/src");
  });

  it("resolves multiple parent directories", () => {
    expect(resolveParentPath("/home/user/project/src/index.ts", 2)).toBe("/home/user/project");
  });
});
