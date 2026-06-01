import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/action-handler.ts";

describe("action-handler.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
