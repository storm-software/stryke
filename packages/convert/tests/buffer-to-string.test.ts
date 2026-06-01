import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/buffer-to-string.ts";

describe("buffer-to-string.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
