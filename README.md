# nw-builder-platforms

Build [NW.js](https://github.com/nwjs/nw.js) applications for Mac, Windows and Linux.

Added multi-platform builds to [nw-builder](https://github.com/nwutils/nw-builder).

## Table of Contents

- [Installation](https://github.com/naviapps/nw-builder-platforms#installation)
- [Usage](https://github.com/naviapps/nw-builder-platforms#usage)
- [API Reference](https://github.com/naviapps/nw-builder-platforms#api-reference)

## Installation

> Tested and runs on Node 14, 16 and 18!

Using npm:

```sh
npm install nw-builder-platforms
```

Using yarn:

```sh
yarn add nw-builder-platforms
```

Using pnpm:

```sh
pnpm add nw-builder-platforms
```

## Usage

For CLI, type in `nwbuilds --help` in your terminal.

## API Reference

### Options

https://github.com/nwutils/nw-builder

#### options.platforms

Type `(CLI)`: `String` (comma separated values)
Type `(API)`: `Array` of `String`
Default value: [`<current OS>`]

The platforms you want to build. Can be `['win32', 'win64', 'osx32', 'osx64', 'osxarm', 'linux32', 'linux64']`

#### options.platform

Not supported.

#### options.arch

Not supported.
