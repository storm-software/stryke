import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-function.ts";

describe("is-function.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
