import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/command-exists.ts";

describe("command-exists.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
