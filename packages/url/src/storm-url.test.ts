import { describe, expect, it } from "vitest";
import * as moduleExports from "./storm-url.ts";

describe("storm-url.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
