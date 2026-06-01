import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-file.ts";

describe("is-file.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
