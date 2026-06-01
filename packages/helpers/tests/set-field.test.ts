import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/set-field.ts";

describe("set-field.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
