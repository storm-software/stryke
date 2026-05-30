import { describe, expect, it } from "vitest";
import * as moduleExports from "./special-cases.ts";

describe("special-cases.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
