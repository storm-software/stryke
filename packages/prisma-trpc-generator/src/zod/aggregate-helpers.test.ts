import { describe, expect, it } from "vitest";
import * as moduleExports from "./aggregate-helpers.ts";

describe("zod/aggregate-helpers.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
