import { describe, expect, it } from "vitest";
import * as moduleExports from "./ed25519.ts";

describe("ed25519.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
