import { describe, expect, it } from "vitest";
import * as moduleExports from "./client.ts";

describe("client.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
