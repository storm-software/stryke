import { describe, expect, it } from "vitest";
import * as moduleExports from "./config.ts";

describe("config.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
