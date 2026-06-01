import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/delay.ts";

describe("delay.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
