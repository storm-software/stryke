import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-set.ts";

describe("is-set.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
