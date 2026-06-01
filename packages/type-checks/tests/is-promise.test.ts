import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-promise.ts";

describe("is-promise.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
