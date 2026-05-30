import { describe, expect, it } from "vitest";
import * as moduleExports from "./nanoid.ts";

describe("nanoid.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
