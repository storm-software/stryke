![Storm Software](https://public.storm-cdn.com/brand-banner.png)

# Changelog for Stryke - Capnp

## [0.7.0](https://github.com/storm-software/stryke/releases/tag/capnp%400.7.0) (2025-06-12)

### Features

- **capnp:** Resolve build issue causing stack overflow
- **capnp:** Added the `no-ts` and `no-dts` CLI options
- **capnp:** Add `capnp-es` vendored code to the distribution

### Bug Fixes

- **capnp:** Resolve issue waiting for stream input during script execution
- **capnp:** Update compiler code to write files in the binary
- **capnp:** Updated the build task definitions to resolve build freezing issue
- **capnp:** Remove cache setting from `project.json` file
- **capnp:** Remove the clean dependency
- **capnp:** Resolve issue generating the vendor build files
- **capnp:** Resolve build issue by adding separate `vendor` build config
- **capnp:** Resolved issue with missing `tsup` dev-dependency

### Miscellaneous

- **monorepo:** Reformat the repository's README markdown files
- **monorepo:** Run format script on repository
- **capnp:** Added back the project caching

### Updated Dependencies

- Updated path to 0.7.6
- Updated fs to 0.20.7

## [0.6.3](https://github.com/storm-software/stryke/releases/tag/capnp%400.6.3) (2025-06-10)

### Bug Fixes

- **capnp:** Ensure the correct `outDir` value is applied in tsconfg

## [0.6.2](https://github.com/storm-software/stryke/releases/tag/capnp%400.6.2) (2025-06-10)

### Bug Fixes

- **capnp:** Resolve issue applying tsconfig during compiler

## [0.6.1](https://github.com/storm-software/stryke/releases/tag/capnp%400.6.1) (2025-06-10)

### Bug Fixes

- **capnp:** Resolve issue with missing package export

## [0.6.0](https://github.com/storm-software/stryke/releases/tag/capnp%400.6.0) (2025-06-10)

### Features

- **capnp:** Added separate `capnp` exports module

## [0.5.0](https://github.com/storm-software/stryke/releases/tag/capnp%400.5.0) (2025-06-10)

### Features

- **capnp:** Export content from `capnp-es` package

## [0.4.5](https://github.com/storm-software/stryke/releases/tag/capnp%400.4.5) (2025-06-08)

### Bug Fixes

- **capnp:** Ensure `capnp-es` is bundled with the package

## [0.4.4](https://github.com/storm-software/stryke/releases/tag/capnp%400.4.4) (2025-06-08)

### Bug Fixes

- **capnp:** Patch `capnp-es` to apply overrides correctly

## [0.4.3](https://github.com/storm-software/stryke/releases/tag/capnp%400.4.3) (2025-06-08)

### Bug Fixes

- **capnp:** Resolve issue with `noImplicitOverride` set to `true`

## [0.4.2](https://github.com/storm-software/stryke/releases/tag/capnp%400.4.2) (2025-06-08)

### Bug Fixes

- **capnp:** Resolve issue with formatting in compiler function

## [0.4.1](https://github.com/storm-software/stryke/releases/tag/capnp%400.4.1) (2025-06-08)

### Bug Fixes

- **capnp:** Resolve issue with defaulting capnpc CLI options

## [0.4.0](https://github.com/storm-software/stryke/releases/tag/capnp%400.4.0) (2025-06-07)

### Features

- **capnp:** Added the `CapnpRPC` shared base class

## [0.3.0](https://github.com/storm-software/stryke/releases/tag/capnp%400.3.0) (2025-06-07)

### Features

- **capnp:** Added a CLI application to invoke `capnpc` process

## [0.2.6](https://github.com/storm-software/stryke/releases/tag/capnp%400.2.6) (2025-06-06)

### Miscellaneous

- **monorepo:** Update workspace package links

### Updated Dependencies

- Updated fs to 0.20.5

## [0.2.5](https://github.com/storm-software/stryke/releases/tag/capnp%400.2.5) (2025-06-04)

### Miscellaneous

- **monorepo:** Update workspace package links

### Updated Dependencies

- Updated path to 0.7.5
- Updated fs to 0.20.4

## [0.2.4](https://github.com/storm-software/stryke/releases/tag/capnp%400.2.4) (2025-06-03)

### Miscellaneous

- **monorepo:** Update workspace package links

### Updated Dependencies

- Updated path to 0.7.3
- Updated fs to 0.20.3

## [0.2.3](https://github.com/storm-software/stryke/releases/tag/capnp%400.2.3) (2025-06-03)

### Miscellaneous

- **monorepo:** Update workspace package links

### Updated Dependencies

- Updated path to 0.7.1

## [0.2.2](https://github.com/storm-software/stryke/releases/tag/capnp%400.2.2) (2025-06-02)

### Bug Fixes

- **fs:** Use the `mlly` package to resolve packages

### Updated Dependencies

- Updated fs to 0.20.2

## [0.2.1](https://github.com/storm-software/stryke/releases/tag/capnp%400.2.1) (2025-06-02)

### Miscellaneous

- **monorepo:** Update workspace package links

### Updated Dependencies

- Updated fs to 0.20.0

## [0.2.0](https://github.com/storm-software/stryke/releases/tag/capnp%400.2.0) (2025-06-02)

### Features

- **fs:** Added the `loadTsConfigSync` helper utility

### Updated Dependencies

- Updated fs to 0.19.0

## [0.1.3](https://github.com/storm-software/stryke/releases/tag/capnp%400.1.3) (2025-06-02)

### Miscellaneous

- **monorepo:** Update workspace package links

### Updated Dependencies

- Updated fs to 0.18.0

## [0.1.2](https://github.com/storm-software/stryke/releases/tag/capnp%400.1.2) (2025-06-02)

### Miscellaneous

- **monorepo:** Update the workspace package links

### Updated Dependencies

- Updated path to 0.7.0
- Updated fs to 0.17.0

## [0.1.1](https://github.com/storm-software/stryke/releases/tag/capnp%400.1.1) (2025-05-29)

### Miscellaneous

- **monorepo:** Update workspace package links

## [0.1.0](https://github.com/storm-software/stryke/releases/tag/capnp%400.1.0) (2025-05-29)

### Features

- **capnp:** Initial check-in of the Cap’n Proto helpers package

### Updated Dependencies

- Updated fs to 0.16.0
