import { describe, expect, it } from "vitest";
import * as moduleExports from "./union.ts";

describe("union.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
