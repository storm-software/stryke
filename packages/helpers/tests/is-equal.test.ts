import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-equal.ts";

describe("is-equal.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
