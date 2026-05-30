import { describe, expect, it } from "vitest";
import * as moduleExports from "./include-helpers.ts";

describe("zod/include-helpers.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
