import { describe, expect, it } from "vitest";
import * as moduleExports from "./remove-file.ts";

describe("remove-file.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
