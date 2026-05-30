import { describe, expect, it } from "vitest";
import * as moduleExports from "./xx-hash.ts";

describe("xx-hash.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
