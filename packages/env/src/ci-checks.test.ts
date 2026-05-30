import { describe, expect, it } from "vitest";
import * as moduleExports from "./ci-checks.ts";

describe("ci-checks.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
