import { describe, expect, it } from "vitest";
import * as moduleExports from "./get-free-port.ts";

describe("get-free-port.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
