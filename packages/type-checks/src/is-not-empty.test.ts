import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-not-empty.ts";

describe("is-not-empty.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
