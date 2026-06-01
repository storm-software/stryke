import { describe, expect, it } from "vitest";
import { isParentPath } from "../src/is-parent-path.ts";

describe("is-parent-path.ts", () => {
  it("detects a direct parent path", () => {
    expect(isParentPath("/home/user/project/src/index.ts", "/home/user/project/src")).toBe(true);
  });

  it("detects a higher parent path", () => {
    expect(isParentPath("/home/user/project/src/index.ts", "/home/user/project")).toBe(true);
  });

  it("returns false for unrelated paths", () => {
    expect(isParentPath("/home/user/project/src/index.ts", "/home/user/other")).toBe(false);
  });

  it("returns false for the same path", () => {
    expect(isParentPath("/home/user/project/src/index.ts", "/home/user/project/src/index.ts")).toBe(false);
  });
});
