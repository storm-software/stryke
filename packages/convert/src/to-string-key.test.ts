import { describe, expect, it } from "vitest";
import * as moduleExports from "./to-string-key.ts";

describe("to-string-key.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
