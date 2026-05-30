import { describe, expect, it } from "vitest";
import * as moduleExports from "./package-manager.ts";

describe("package-manager.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
