import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/messages.ts";

describe("messages.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
