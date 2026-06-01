import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/with-timeout.ts";

describe("with-timeout.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
