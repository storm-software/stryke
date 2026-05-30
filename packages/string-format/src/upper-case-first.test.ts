import { describe, expect, it } from "vitest";
import * as moduleExports from "./upper-case-first.ts";

describe("upper-case-first.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
