import { describe, expect, it } from "vitest";
import { normalizeEmail } from "./normalize-email.ts";

describe("normalize-email.ts", () => {
  it("normalizes email addresses", () => {
    expect(normalizeEmail("Mike.Johnson+twitter@Gmail.com")).toBe("mikejohnson@gmail.com");
  });

  it("rejects invalid email formats", () => {
    expect(() => normalizeEmail("invalid-email")).toThrow("invalid_email_format");
  });
});
