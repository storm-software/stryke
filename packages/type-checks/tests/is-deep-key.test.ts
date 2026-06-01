import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-deep-key.ts";

describe("is-deep-key.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
