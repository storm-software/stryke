import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/file.ts";

describe("file.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
