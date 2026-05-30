import { describe, expect, it } from "vitest";
import { isEqual } from "./is-equal.ts";

describe("is-equal.ts", () => {
  it("returns true for identical paths", () => {
    expect(isEqual("/home/user/project/src/index.ts", "/home/user/project/src/index.ts")).toBe(true);
  });

  it("treats trailing slashes as equivalent", () => {
    expect(isEqual("/home/user/project/src/index.ts", "/home/user/project/src/index.ts/")).toBe(true);
  });

  it("supports case-insensitive comparisons when requested", () => {
    expect(
      isEqual("/home/user/project/src/index.ts", "/home/user/project/src/INDEX.TS", {
        ignoreCase: true
      })
    ).toBe(true);
  });

  it("returns false for different paths", () => {
    expect(isEqual("/home/user/project/src/index.ts", "/home/user/project/src/other.ts")).toBe(false);
  });
});
