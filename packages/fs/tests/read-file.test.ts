import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/read-file.ts";

describe("read-file.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
