import { describe, expect, it } from "vitest";
import * as moduleExports from "./snake-case.ts";

describe("snake-case.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
