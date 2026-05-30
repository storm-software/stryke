import { describe, expect, it } from "vitest";
import * as moduleExports from "./generator-helpers.ts";

describe("zod/generator-helpers.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
