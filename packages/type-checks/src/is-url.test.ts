import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-url.ts";

describe("is-url.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
