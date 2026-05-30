import { describe, expect, it } from "vitest";
import { escapeHtml, escapeRegExp } from "./escape.ts";

describe("escape.ts", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml('This is a <div> & "quote"')).toBe("This is a &lt;div&gt; &amp; &quot;quote&quot;");
  });

  it("escapes regexp special characters", () => {
    expect(escapeRegExp("Price is $5.00")).toBe("Price is \\$5\\.00");
  });
});
