import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-boolean.ts";

describe("is-boolean.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
