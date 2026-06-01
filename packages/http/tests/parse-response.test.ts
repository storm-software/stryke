import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/parse-response.ts";

describe("parse-response.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
