import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/write-file.ts";

describe("write-file.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
