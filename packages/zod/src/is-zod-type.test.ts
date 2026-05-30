import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-zod-type.ts";

describe("is-zod-type.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
