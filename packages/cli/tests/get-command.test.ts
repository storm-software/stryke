import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/get-command.ts";

describe("get-command.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
