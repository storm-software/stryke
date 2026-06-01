import { describe, expect, it } from "vitest";
import * as moduleExports from "../../src/shield/index.ts";

describe("shield/index.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
