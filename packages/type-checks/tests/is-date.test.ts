import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-date.ts";

describe("is-date.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
