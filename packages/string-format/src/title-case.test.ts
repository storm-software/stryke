import { describe, expect, it } from "vitest";
import * as moduleExports from "./title-case.ts";

describe("title-case.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
