import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/copy-file.ts";

describe("copy-file.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
