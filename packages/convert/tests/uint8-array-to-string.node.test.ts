import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/uint8-array-to-string.node.ts";

describe("uint8-array-to-string.node.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
