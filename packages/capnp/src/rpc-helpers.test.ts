import { describe, expect, it } from "vitest";
import * as moduleExports from "./rpc-helpers.ts";

describe("rpc-helpers.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
