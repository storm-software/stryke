import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/hash-content.ts";

describe("hash-content.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
