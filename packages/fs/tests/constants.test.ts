import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/constants.ts";

describe("constants.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
