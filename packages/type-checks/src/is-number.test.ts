import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-number.ts";

describe("is-number.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
