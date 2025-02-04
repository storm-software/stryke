<!-- START header -->
<!-- END header -->

# Stryke - Unique Identifiers

A package containing various helper functions to generate unique identifier
strings.

## Available Identifiers

This package includes generator functions for the following type of identifiers:

| Identifier                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Details                                                                                  |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Snowflake Identifier                 | Snowflakes are 64 bits in binary. (Only 63 are used to fit in a signed integer.) The first 41 bits are a timestamp, representing milliseconds since the chosen epoch. The next 10 bits represent a machine ID, preventing clashes. Twelve more bits represent a per-machine sequence number, to allow creation of multiple snowflakes in the same millisecond. The final number is generally serialized in decimal.                                                         | <https://en.wikipedia.org/wiki/Snowflake_ID>                                             |
| Universally Unique Identifier (UUID) | A universally unique identifier (UUID) is a 128-bit number used to identify information in computer systems. The term globally unique identifier (GUID) is also used, typically in software created by Microsoft. When generated according to the standard methods, UUIDs are for practical purposes unique. Their uniqueness does not depend on a central registration authority or coordination between the parties generating them, unlike most other numbering schemes. | <https://en.wikipedia.org/wiki/Universally_unique_identifier>                            |
| Customer User Identifier (CUID)      | Collision-resistant IDs optimized for horizontal scaling and performance.                                                                                                                                                                                                                                                                                                                                                                                                   | <https://support.appsflyer.com/hc/en-us/articles/207032016-Customer-User-ID-field-CUID-> |
| Nano ID      | A tiny (124 bytes), secure, URL-friendly, unique string ID generator for JavaScript                                                                                                                                                                                                                                                                                                                                                                                                   | <https://github.com/ai/nanoid> |

<!-- START doctoc -->
<!-- END doctoc -->

## Installing

Using [pnpm](http://pnpm.io):

```bash
pnpm add -D stryke/unique-id
```

<details>
  <summary>Using npm</summary>

```bash
npm install -D stryke/unique-id
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add -D stryke/unique-id
```

</details>

## Reduced Package Size

This project uses [tsup](https://tsup.egoist.dev/) to package the source code
due to its ability to remove unused code and ship smaller javascript files
thanks to code splitting. This helps to greatly reduce the size of the package
and to make it easier to use in other projects.

## Development

This project is built using [Nx](https://nx.dev). As a result, many of the usual
commands are available to assist in development.

### Building

Run `nx build unique-id` to build the library.

### Running unit tests

Run `nx test unique-id` to execute the unit tests via [Jest](https://jestjs.io).

### Linting

Run `nx lint unique-id` to run [ESLint](https://eslint.org/) on the package.

<!-- START footer -->
<!-- END footer -->
