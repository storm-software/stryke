import { describe, expect, it } from "vitest";
import * as moduleExports from "./load-env.ts";

describe("load-env.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
