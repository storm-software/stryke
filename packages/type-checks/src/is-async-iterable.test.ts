import { describe, expect, it } from "vitest";
import * as moduleExports from "./is-async-iterable.ts";

describe("is-async-iterable.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
