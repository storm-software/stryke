import { describe, expect, it } from "vitest";
import { unescape } from "./unescape.ts";

describe("unescape.ts", () => {
  it("unescapes HTML entities", () => {
    expect(unescape("This is a &lt;div&gt; &amp; &quot;quote&quot;")).toBe('This is a <div> & "quote"');
  });
});
