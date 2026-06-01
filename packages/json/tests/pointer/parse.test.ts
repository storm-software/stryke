import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/pointer/parse.ts";

describe("pointer/parse.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
