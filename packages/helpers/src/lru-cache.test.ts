import { describe, expect, it } from "vitest";
import * as moduleExports from "./lru-cache.ts";

describe("lru-cache.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
