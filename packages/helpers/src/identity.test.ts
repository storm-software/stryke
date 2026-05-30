import { describe, expect, it } from "vitest";
import * as moduleExports from "./identity.ts";

describe("identity.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
