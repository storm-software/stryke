import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/use-did-finish-ssr.ts";

describe("use-did-finish-ssr.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
