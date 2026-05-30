import { describe, expect, it } from "vitest";
import * as moduleExports from "./project.ts";

describe("project.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
