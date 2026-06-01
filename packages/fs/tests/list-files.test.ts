import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/list-files.ts";

describe("list-files.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
