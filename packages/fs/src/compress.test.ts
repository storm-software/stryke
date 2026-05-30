import { describe, expect, it } from "vitest";
import * as moduleExports from "./compress.ts";

describe("compress.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
