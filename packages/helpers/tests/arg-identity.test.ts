import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/arg-identity.ts";

describe("arg-identity.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
