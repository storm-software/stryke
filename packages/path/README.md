<!-- START header -->
<!-- END header -->

# Stryke - Path Utilities

A package containing various utilities that expand the functionality of
NodeJs&#39;s \`path\` module

<!-- START doctoc -->
<!-- END doctoc -->

## Installing

Using [pnpm](http://pnpm.io):

```bash
pnpm add -D @stryke/path
```

<details>
  <summary>Using npm</summary>

```bash
npm install -D @stryke/path
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add -D @stryke/path
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

Run `nx build path` to build the library.

### Running unit tests

Run `nx test path` to execute the unit tests via [Jest](https://jestjs.io).

### Linting

Run `nx lint path` to run [ESLint](https://eslint.org/) on the package.

<!-- START footer -->
<!-- END footer -->
