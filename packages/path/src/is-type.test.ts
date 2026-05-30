import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-type.ts";

describe("is-type.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
