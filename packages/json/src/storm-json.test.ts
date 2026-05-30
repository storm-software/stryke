import { describe, expect, it } from "vitest";
import * as moduleExports from "./storm-json.ts";

describe("storm-json.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
