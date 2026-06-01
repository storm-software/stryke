import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/noop.ts";

describe("noop.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
