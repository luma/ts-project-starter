# Typescript Project Starter

This is a project starter for a NodeJs project. It uses Typescript, Babel,
Jest, Eslint, and Prettier.

It implements a simple [HTTP2](https://en.wikipedia.org/wiki/HTTP/2) server that
responds to every request with "Hello World".

This exists because I'm tired of having to recreate this everytime I start a new
backend project in Node ;-)

- [Typescript Project Starter](#typescript-project-starter)
  - [What this contains](#what-this-contains)
    - [TODO](#todo)
  - [Prerequisites](#prerequisites)
  - [Initial setup](#initial-setup)
    - [Clone It](#clone-it)
    - [Rename the relevant parts](#rename-the-relevant-parts)
    - [Remove the existing git history](#remove-the-existing-git-history)
    - [Get our dependencies and ensure that we can build](#get-our-dependencies-and-ensure-that-we-can-build)
    - [Verify that our Hello World server works](#verify-that-our-hello-world-server-works)
    - [Where to from here](#where-to-from-here)
  - [Building](#building)
    - [Removing all build artifacts](#removing-all-build-artifacts)
  - [Running the tests and linting](#running-the-tests-and-linting)
  - [Running your project for local dev](#running-your-project-for-local-dev)

## What this contains

- Setup for [Typescript](https://www.typescriptlang.org/).
- Uses [Babel 7](https://babeljs.io/) for Transpilation.
- [Jest](https://jestjs.io/) for tests and coverage reporting.
- [Eslint](https://eslint.org/)+[Prettier](https://prettier.io/) for
linting and style of ts/js files.
- Markdown linting of README.md.
- The code itself is for a simple "Hello World" HTTP2 Server.
- Logging via [Pino](https://getpino.io/).
- Using [Make](https://en.wikipedia.org/wiki/Make_(software)) as it's
build system.

### TODO

- commmit hooks to enforce that tests and linting checks pass
- Proper test coverage
- CI pipeline with Github Actions

## Prerequisites

Make sure you have [yarn](https://yarnpkg.com/getting-started/install) installed.
You also need automake install (`brew install make` should do the trick on Mac OS).

**Note** this only supports Yarn v1 (classic) presently.

## Initial setup

Rather than being a generator like `create-react-app` the idea is that you take
this code and make it your own. This does make it a little more opinionated,
but I've done my best to document those opinions as I go along so you'll know
when I'm dragging you along for the ride.

To make the starter your own you should:

1. Clone it.
2. Rename the relevant parts.
3. Remove the existing git history and reinitialise a new git history for
your project.
4. Get our dependencies and ensure that we can build
5. Verify that our Hello World server works

Assuming your project was called `myAwesomeProjectName`, you would run something
like the following

### Clone It

``` shell
git clone --depth=1 --branch=main https://github.com/luma/ts-project-starter.git
```

### Rename the relevant parts

``` shell
mv ts-project-starter myAwesomeProjectName
```

Then update the project name in `package.json`.

### Remove the existing git history

``` shell
cd myAwesomeProjectName
rm -rf .git
git init
```

You now have a clean project called `myAwesomeProjectName` with an empty
git history.

### Get our dependencies and ensure that we can build

Let's get our dependencies and make sure we can build:

``` shell
make
```

The default `make` task (which is the first take in `Makefile`) will do a
`yarn install` for you before building your code.

### Verify that our Hello World server works

You should now be able to turn on the server with `yarn start:dev`.

You can visit your new backend on `https://localhost:3004/`. Note that the
backend is `https` only, this is because
[HTTP2](https://en.wikipedia.org/wiki/HTTP/2) is https only
<sup>[1](#footnote-1)</sup>. The good news is that your new backend is a little
more secure out of the box.

> **Note** You will see a warning about the certificate that we're using when
> you view the endpoint in your browser. This is because we're using a self-signed
> SSL certificate for local dev, as opposed to one signed by one of the official
> Certificate Authority.
>
> You can tell your browser to permanently accept that certicate for localhost,
> but you must remember to replace it for any use outside of local development.
>
> You can find the self-signed certificate and private key in `./config/`.

1. <a name="footnote-1"></a> Well...it doesn't but it does. Some members of
the working group wanted it to be, others didn't. So the spec says it isn't
required, but most implementations don't support unencrypted HTTP2. You can
read a bit more about this on
[Mandatory encryption on HTTP2](https://en.wikipedia.org/wiki/HTTP/2#Mandatory_encryption_computational_cost_and_certificate_availability).


### Where to from here

- You can now remove or rewrite the "Initial setup" section for your project.
- Some kind of actual server logic, our Hello World request handler is a bit
limited ;-)
- There is no request routing, all requests go through the single "Hello World"
request handler. If your backend needs more than one endpoint then you'll likely
want to add some.
- Better test coverage.

## Building

``` shell
make
```

To just type check your code

``` shell
make check-types
```

### Removing all build artifacts

``` shell
make clean
```

## Running the tests and linting

``` shell
make test
make lint
```

## Running your project for local dev

``` shell
yarn start:dev
```
