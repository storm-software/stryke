import { describe, expect, it } from "vitest";
import * as moduleExports from "./docs-helpers.ts";

describe("zod/docs-helpers.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
