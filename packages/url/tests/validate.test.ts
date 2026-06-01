import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/validate.ts";

describe("validate.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
