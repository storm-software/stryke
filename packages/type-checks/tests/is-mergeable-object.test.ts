import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-mergeable-object.ts";

describe("is-mergeable-object.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
