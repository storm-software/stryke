import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/encryption.node.ts";

describe("encryption.node.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
