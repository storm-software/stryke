import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/unflatten-object.ts";

describe("unflatten-object.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
