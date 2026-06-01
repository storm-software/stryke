import { describe, expect, it } from "vitest";
import * as moduleExports from "./write-file-safely.ts";

describe("utils/write-file-safely.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
