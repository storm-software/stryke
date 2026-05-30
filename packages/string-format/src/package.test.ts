import { describe, expect, it } from "vitest";
import { getPackageName, getPackageVersion, hasPackageVersion, removePackageVersion } from "./package.ts";

describe("package.ts", () => {
  it("detects and removes package versions", () => {
    expect(hasPackageVersion("lodash@4.17.21")).toBe(true);
    expect(removePackageVersion("lodash@4.17.21")).toBe("lodash");
    expect(getPackageVersion("lodash@4.17.21")).toBe("4.17.21");
  });

  it("extracts package names from nested package paths", () => {
    expect(getPackageName("@stryke/core/module@4.17.21")).toBe("@stryke/core");
    expect(getPackageName("lodash/module")).toBe("lodash");
  });
});
