import { describe, expect, it } from "vitest";
import * as moduleExports from "./resolve-parent-path.ts";

describe("resolve-parent-path.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
