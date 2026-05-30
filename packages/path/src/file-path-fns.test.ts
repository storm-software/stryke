import { describe, expect, it } from "vitest";
import * as moduleExports from "./file-path-fns.ts";

describe("file-path-fns.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
