import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/use-compose-refs.ts";

describe("use-compose-refs.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
