import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/define-command.ts";

describe("define-command.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
