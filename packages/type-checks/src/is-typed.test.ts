import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-typed.ts";

describe("is-typed.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
