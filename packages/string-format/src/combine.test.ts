import { describe, expect, it } from "vitest";
import * as moduleExports from "./combine.ts";

describe("combine.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
