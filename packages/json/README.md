<!-- START header -->
<!-- END header -->

# Stryke - JSON Utility

A package that includes the `StormJSON` utility class. This class is used in the same way as the built-in `JSON` type in NodeJs; however, it allows for more flexibility and customization. 

<!-- START doctoc -->
<!-- END doctoc -->

## Installing

Using [pnpm](http://pnpm.io):

```bash
pnpm add -D @storm-stack/utils-json
```

<details>
  <summary>Using npm</summary>

```bash
npm install -D @storm-stack/utils-json
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add -D @storm-stack/utils-json
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

Run `nx build utils-json` to build the library.

### Running unit tests

Run `nx test utils-json` to execute the unit tests via
[Jest](https://jestjs.io).

### Linting

Run `nx lint utils-json` to run [ESLint](https://eslint.org/) on the package.

<!-- START footer -->
<!-- END footer -->
