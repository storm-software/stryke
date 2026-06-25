import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  BaseResolveOptions,
  BundleOptions,
  FilePathResolveOptions,
  GitHubReference,
  GitLabReference,
  InferResolveOptions,
  LoadInput,
  ResolveInput,
  URLReference,
  URLResolveOptions
} from "../src/types";
import * as moduleExports from "../src/types";

describe("types.ts exports", () => {
  it("loads runtime exports object", () => {
    expect(moduleExports).toBeDefined();
    expect(typeof moduleExports).toBe("object");
  });

  it("defines GitHubReference and GitLabReference template literal types", () => {
    expectTypeOf<GitHubReference>().toMatchTypeOf<
      `github:${string}` | `gh:${string}`
    >();
    expectTypeOf<GitLabReference>().toMatchTypeOf<
      `gitlab:${string}` | `gl:${string}`
    >();
  });

  it("defines URLReference and ResolveInput aliases", () => {
    expectTypeOf<URLReference>().toMatchTypeOf<string>();
    expectTypeOf<ResolveInput>().toMatchTypeOf<string | URL>();
  });

  it("defines option types", () => {
    expectTypeOf<BaseResolveOptions>().toMatchTypeOf<{ extension?: string }>();
    expectTypeOf<URLResolveOptions>().toMatchTypeOf<{
      extension?: string;
      headers?: Record<string, string>;
    }>();
    expectTypeOf<BundleOptions>().toMatchTypeOf<Record<string, unknown>>();
    expectTypeOf<FilePathResolveOptions>().toMatchTypeOf<
      Record<string, unknown>
    >();
  });

  it("infers options from resolve input types", () => {
    expectTypeOf<
      InferResolveOptions<URLReference>
    >().toMatchTypeOf<URLResolveOptions>();
    expectTypeOf<InferResolveOptions<URL>>().toMatchTypeOf<URLResolveOptions>();
    expectTypeOf<
      InferResolveOptions<string>
    >().toMatchTypeOf<FilePathResolveOptions>();
  });

  it("defines LoadInput", () => {
    expectTypeOf<LoadInput>().toMatchTypeOf<ResolveInput>();
  });
});
