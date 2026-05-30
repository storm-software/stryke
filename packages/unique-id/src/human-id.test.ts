import { describe, expect, it } from "vitest";
import { humanId } from "./human-id.ts";

describe("human-id.ts", () => {
  it("returns a hyphenated human-readable id", () => {
    const value = humanId({});

    expect(value).toMatch(/^[a-z]+(?:-[a-z]+)+$/);
  });
});
