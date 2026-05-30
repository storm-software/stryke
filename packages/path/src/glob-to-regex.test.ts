import { describe, expect, it } from "vitest";
import * as moduleExports from "./glob-to-regex.ts";

describe("glob-to-regex.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
