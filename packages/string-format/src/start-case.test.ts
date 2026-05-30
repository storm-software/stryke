import { describe, expect, it } from "vitest";
import * as moduleExports from "./start-case.ts";

describe("start-case.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
