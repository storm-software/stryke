import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-plain-object.ts";

describe("is-plain-object.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
