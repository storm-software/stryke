import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-object-index.ts";

describe("is-object-index.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
