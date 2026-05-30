import { describe, expect, it } from "vitest";
import { decamelize } from "./decamelize.ts";

describe("decamelize", () => {
  it.each([
    ["camelCase", "camel_case"],
    ["PascalCase", "pascal_case"],
    ["HTTPServerValue", "http_server_value"],
    ["already_snake", "already_snake"],
    ["version2Value", "version2_value"]
  ])("formats %s to %s", (input, expected) => {
    expect(decamelize(input)).toBe(expected);
  });
});
