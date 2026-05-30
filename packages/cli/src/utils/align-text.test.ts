import { describe, expect, it } from "vitest";
import * as moduleExports from "./align-text.ts";

describe("utils/align-text.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
