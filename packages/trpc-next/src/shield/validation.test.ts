import { describe, expect, it } from "vitest";
import * as moduleExports from "./validation.ts";

describe("shield/validation.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
