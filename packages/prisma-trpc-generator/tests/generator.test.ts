import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/generator.ts";

describe("generator.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
