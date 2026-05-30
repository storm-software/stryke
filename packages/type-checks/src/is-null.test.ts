import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-null.ts";

describe("is-null.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
