import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/environment-checks.ts";

describe("environment-checks.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
