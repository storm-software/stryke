import { describe, expect, it } from "vitest";
import { ACRONYMS } from "../src/acronyms.ts";

describe("acronyms.ts", () => {
  it("contains common acronym entries", () => {
    expect(ACRONYMS.API.description).toBe("Application Programming Interface");
    expect(ACRONYMS.DEVOPS.description).toBe("Development Operations");
    expect(ACRONYMS.HTTP.display).toBeUndefined();
  });
});
