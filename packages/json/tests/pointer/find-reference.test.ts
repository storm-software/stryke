import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/pointer/find-reference.ts";

describe("pointer/find-reference.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
