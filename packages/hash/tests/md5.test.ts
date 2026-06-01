import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/md5.ts";

describe("md5.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
