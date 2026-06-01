import { describe, expect, it } from "vitest";
import { camelCase, prettyBytes, titleCase } from "../src/index.ts";

describe("index.ts", () => {
  it("re-exports representative formatting helpers", () => {
    expect(camelCase("Hello world")).toBe("helloWorld");
    expect(titleCase("hello world")).toBe("Hello World");
    expect(prettyBytes(1337)).toBe("1.34 kB");
  });
});
