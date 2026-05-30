import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-empty-object.ts";

describe("is-empty-object.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
