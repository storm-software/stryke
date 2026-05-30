import { describe, expect, it } from "vitest";
import * as moduleExports from "./utils.ts";

describe("shield/utils.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
