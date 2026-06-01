import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/use-copy-to-clipboard.ts";

describe("use-copy-to-clipboard.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
