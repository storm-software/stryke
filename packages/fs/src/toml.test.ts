import { describe, expect, it } from "vitest";
import * as moduleExports from "./toml.ts";

describe("toml.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
