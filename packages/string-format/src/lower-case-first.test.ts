import { describe, expect, it } from "vitest";
import * as moduleExports from "./lower-case-first.ts";

describe("lower-case-first.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
