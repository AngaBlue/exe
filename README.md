<h1 align="center">Node.js Windows Executable</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/@angablue/exe" target="_blank">
  <img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/AngaBlue/exe?label=Version">
  </a>
  <a href="https://github.com/AngaBlue/exe/blob/main/LICENSE" target="_blank">
    <img alt="License: LGPL--3.0--or--later" src="https://img.shields.io/github/license/AngaBlue/exe?color=green" />
  </a>
</p>

Build a portable binary for Windows systems using Node's [SEA](https://nodejs.org/api/single-executable-applications.html). This project serves to and aid in automating bundling your source code with [`@vercel/ncc`](https://github.com/vercel/ncc) and modifying the executable properties post build with [`resedit-js`](https://www.npmjs.com/package/resedit).

### 🏠 [Homepage](https://github.com/AngaBlue/exe)

## Install

Install this package and save to `devDependencies` using your package manager of choice.

```sh
npm i -D @angablue/exe
```

⚠️**Warning**⚠️: This package is only supported on Windows systems running Node `v20.0.0` or newer.  For older versions of Node (`v12.0.0` or newer), please use the version `v2.1.3` of this package

```sh
npm i -D @angablue/exe@2.1.3
```

*Please note that the older version of this package is no longer maintained.  Refer to the [previous documentation here](https://github.com/AngaBlue/exe/blob/b0ddec947e948bd4172b2662296ccb30356e0de0/README.md).*

## CLI Usage

Point to a JSON configuration file (default `exe.json`) to build your executable:

```sh
npx exe exe.json
```

### Configuration File

Create a JSON configuration file (`exe.json`) with the following options:

```json
{
    "entry": "index.js",
    "out": "My Cool App.exe"
}
```
`@angablue/exe` has first-class TypeScript support.  You can use it in your TypeScript projects without any additional configuration by specifying your TypeScript entry file (such as `index.ts`).

Optionally, you can specify more arguments and completely customise the resultant executable:

```json
{
    "entry": "index.js",
    "out": "My Cool App.exe",
    "skipBundle": false,
    "version": "package:version",
    "icon": "icon.ico",
    "executionLevel": "asInvoker",
    "properties": {
        "FileDescription": "My Cool App",
        "ProductName": "My Cool App",
        "LegalCopyright": "Copyright package:author.name",
        "OriginalFilename": "package:name"
    }
}
```

## API Usage
If you prefer to use this package programmatically, you can import this module into your Node.js script:

```js
// build.js
const exe = require("@angablue/exe");

const build = exe({
  entry: "./index.js",
  out: "./build/My Cool App.exe",
});

build.then(() => console.log("Build completed!"));
```

## Example Usage

Specify more arguments and completely customise the resultant executable.

```js
// build.js
const exe = require("@angablue/exe");

const build = exe({
  entry: "./index.js",
  out: "./build/My Cool App.exe",
  skipBundle: false,
  version: "2.4.2",
  icon: "./assets/icon.ico", // Application icons must be in .ico format
  executionLevel: "asInvoker",
  properties: {
    FileDescription: "My Cool App",
    ProductName: "My Cool App",
    LegalCopyright: "AngaBlue https://anga.blue",
    OriginalFilename: "My Cool App.exe",
  },
});

build.then(() => console.log("Build completed!"));
```

## Configuration Options

| Option           | Description                                                                   | Required | Default Value      | Example Value                             | Possible Values                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------- | -------- | ------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `entry`          | Path to the entry file of the application.                                    | Yes      | N/A                | `'./index.js'`                            | Any valid file path to a `.js`/`.ts` script.                                                                          |
| `out`            | Path for the output executable file.                                          | Yes      | N/A                | `'./build/My Cool App.exe'`               | Any valid file path (ending with `.exe`).                                                                             |
| `skipBundle`     | Skip the bundling process and use provided entry file as is.                  | No       | `false`            | `true`                                    | `Boolean`                                                                                                             |
| `version`        | Version of the application.                                                   | No       | None               | `'2.4.2'`                                 | Semantic version string. e.g. `major.minor.patch`                                                                     |
| `icon`           | Path to the application's icon in .ico format.                                | No       | Node.js icon       | `'./assets/icon.ico'`                     | Any valid file path to a `.ico` icon.                                                                                 |
| `executionLevel` | Execution level for the application.                                          | No       | `'asInvoker'`      | `'asInvoker'`                             | `asInvoker`, `highestAvailable`, `requireAdministrator`                                                               |
| `properties`     | Metadata for the executable file.                                             | No       | None               | `{ FileDescription: 'My Cool App', ... }` | Key-value pairs as shown in example.                                                                                  |

### Note on `properties`:

- `FileDescription`: Description of the executable.
- `ProductName`: Name of the product.
- `LegalCopyright`: Copyright details with the URL.
- `OriginalFilename`: Name of the original file.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © [AngaBlue](https://github.com/AngaBlue).<br />
This project is [LGPL--3.0--or--later](https://github.com/AngaBlue/exe/blob/main/LICENSE) licensed.
