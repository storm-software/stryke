import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-float.ts";

describe("is-float.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
