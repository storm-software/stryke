import { describe, expect, it } from "vitest";
import * as moduleExports from "./uint8-array-to-stream.ts";

describe("uint8-array-to-stream.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
