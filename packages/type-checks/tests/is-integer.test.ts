import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-integer.ts";

describe("is-integer.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
