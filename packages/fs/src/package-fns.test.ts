import { describe, expect, it } from "vitest";
import * as moduleExports from "./package-fns.ts";

describe("package-fns.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
