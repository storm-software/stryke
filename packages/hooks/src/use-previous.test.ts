import { describe, expect, it } from "vitest";
import * as moduleExports from "./use-previous.ts";

describe("use-previous.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
