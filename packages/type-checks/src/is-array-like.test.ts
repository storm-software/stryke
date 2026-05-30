import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-array-like.ts";

describe("is-array-like.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
