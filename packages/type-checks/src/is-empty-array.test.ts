import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-empty-array.ts";

describe("is-empty-array.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
