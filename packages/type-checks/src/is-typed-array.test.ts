import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-typed-array.ts";

describe("is-typed-array.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
