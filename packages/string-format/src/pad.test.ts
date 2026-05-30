import { describe, expect, it } from "vitest";
import * as moduleExports from "./pad.ts";

describe("pad.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
