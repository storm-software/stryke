import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-symbol.ts";

describe("is-symbol.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
