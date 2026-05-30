import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-file-result.ts";

describe("is-file-result.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
