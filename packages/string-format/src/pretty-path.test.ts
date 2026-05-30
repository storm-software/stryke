import { describe, expect, it } from "vitest";
import * as moduleExports from "./pretty-path.ts";

describe("pretty-path.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
