import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/to-deep-key.ts";

describe("to-deep-key.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
