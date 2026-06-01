import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-bigint.ts";

describe("is-bigint.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
