import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-object.ts";

describe("is-object.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
