# Typescript Project Starter

This is a project start for a Node project that uses Typescript and Babel.

This exists because I'm tired of having to recreate this everytime ;-)

## What this contains

* Setup for [Typescript](https://www.typescriptlang.org/).
* Uses [Babel 7](https://babeljs.io/) for Transpilation.
* [Jest](https://jestjs.io/) for tests and coverage reporting.
* [Eslint](https://eslint.org/)+[Prettier](https://prettier.io/) for
linting and style of ts/js files.
* Markdown linting of README.md.
* The code itself is for a simple "Hello World" HTTP2 Server.
* Logging via [Pino](https://getpino.io/).

### TODO

* commmit hooks to enforce that tests and linting checks pass
* Proper test coverage

## Initial setup

Make sure you have [yarn](https://yarnpkg.com/getting-started/install) installed.
You also need automake install (`brew install make` should do the trick on Mac OS).

**Note** this only supports Yarn v1 (classic) presently.

Now run:

``` bash
make
```

This will install your dependencies and then attempt to build your project.

## Building

``` bash
make
```

To just type check your code

``` bash
make check-types
```

## Running the tests and linting

``` bash
make test
make lint
```

## Running your project for local dev

``` bash
yarn start:dev
```
