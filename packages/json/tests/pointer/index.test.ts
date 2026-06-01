import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/pointer/index.ts";

describe("pointer/index.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
