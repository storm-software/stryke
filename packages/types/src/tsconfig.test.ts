import { describe, expect, it } from "vitest";
import * as moduleExports from "./tsconfig.ts";

describe("tsconfig.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
