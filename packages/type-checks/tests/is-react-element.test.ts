import { describe, expect, it } from "vitest";
import * as moduleExports from "../src/is-react-element.ts";

describe("is-react-element.ts exports", () => {
  it("loads module exports", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });
});
