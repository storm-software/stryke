import { describe, expect, it } from "vitest";
import * as moduleExports from "./yaml.ts";

describe("yaml.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
