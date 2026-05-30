import { describe, expect, it } from "vitest";
import {
  isAbsolute,
  isAbsolutePath,
  isNpmScopedPackage,
  isNpmScopedPackagePath,
  isRelative,
  isRelativePath
} from "./is-type.ts";

describe("is-type.ts", () => {
  it("detects absolute paths", () => {
    expect(isAbsolutePath("/home/user/project")).toBe(true);
    expect(isAbsolute("C:\\repo\\stryke")).toBe(true);
  });

  it("detects relative paths", () => {
    expect(isRelativePath("src/index.ts")).toBe(true);
    expect(isRelative("src/index.ts")).toBe(true);
  });

  it("detects npm scoped package paths", () => {
    expect(isNpmScopedPackagePath("@stryke/path")).toBe(true);
    expect(isNpmScopedPackage("./src/index.ts")).toBe(false);
  });
});
