import { describe, expect, it } from "vitest";
import * as moduleExports from "./whereUniqueInput-helpers.ts";

describe("zod/whereUniqueInput-helpers.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
