import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/shield/types.ts";

describe("shield/types.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
