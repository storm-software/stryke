import { describe, expect, it } from "vitest";
import * as moduleExports from "./base.ts";

describe("base.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
