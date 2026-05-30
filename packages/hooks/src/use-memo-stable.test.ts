import { describe, expect, it } from "vitest";
import * as moduleExports from "./use-memo-stable.ts";

describe("use-memo-stable.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
