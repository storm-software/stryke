import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/remove-empty-items.ts";

describe("remove-empty-items.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
