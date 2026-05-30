import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-collection.ts";

describe("is-collection.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
