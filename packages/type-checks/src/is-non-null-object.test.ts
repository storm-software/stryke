import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-non-null-object.ts";

describe("is-non-null-object.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
