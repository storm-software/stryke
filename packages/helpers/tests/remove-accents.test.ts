import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/remove-accents.ts";

describe("remove-accents.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
