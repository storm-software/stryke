import { describe, expect, it } from "vitest";
import * as moduleExports from "./format-special-cases.ts";

describe("format-special-cases.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
