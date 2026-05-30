import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-parent-path.ts";

describe("is-parent-path.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
