import { describe, expect, it } from "vitest";
import * as moduleExports from "./use-escape-keydown.ts";

describe("use-escape-keydown.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
