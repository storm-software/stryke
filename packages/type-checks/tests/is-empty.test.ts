import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-empty.ts";

describe("is-empty.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
