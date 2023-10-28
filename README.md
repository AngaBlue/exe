<h1 align="center">Node.js Windows Executable</h1>
<p align="center">
    <a href="https://github.com/AngaBlue/exe/packages/1108141" target="_blank">
  <img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/AngaBlue/exe?label=Version">
  </a>
  <a href="https://github.com/AngaBlue/exe/blob/master/LICENSE" target="_blank">
    <img alt="License: LGPL--3.0--or--later" src="https://img.shields.io/github/license/AngaBlue/exe?color=green" />
  </a>
</p>

Build a portable binary for Windows systems using Vercel's [pkg](https://www.npmjs.com/package/pkg). As [pkg](https://www.npmjs.com/package/pkg) doesn't support modifying executable properties, this project serves to and aid in automating modifying the executable properties post build with the aid of [resedit-js](https://www.npmjs.com/package/resedit).

### 🏠 [Homepage](https://github.com/AngaBlue/exe)

## Install

Install this package and save to `devDependencies` using your package manager of choice.

```sh
 npm i -D @angablue/exe
```

## Basic Usage

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
  pkg: ["-C", "GZip"], // Specify extra pkg arguments
  version: "2.4.2",
  target: "latest-win-x64",
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
| `entry`          | Path to the entry file of the application.                                    | Yes      | N/A                | `'./index.js'`                            | Any valid file path.                                                                                                  |
| `out`            | Path for the output executable file.                                          | Yes      | N/A                | `'./build/My Cool App.exe'`               | Any valid file path.                                                                                                  |
| `pkg`            | [Extra arguments for the pkg package](https://github.com/vercel/pkg#options). | No       | `[]`               | `['-C', 'GZip']`                          | Array of pkg arguments.                                                                                               |
| `version`        | Version of the application.                                                   | No       | None               | `'2.4.2'`                                 | Semantic version string. e.g. `major.minor.patch`                                                                     |
| `target`         | Target node version and architecture.                                         | No       | `'latest-win-x64'` | `'latest-win-x64'`                        | Windows [pkg target string](https://github.com/vercel/pkg#options). e.g. `latest-win-x64`, `node18-windows-x64`, etc. |
| `icon`           | Path to the application's icon in .ico format.                                | No       | Node.js icon       | `'./assets/icon.ico'`                     | Any valid .ico file path.                                                                                             |
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
This project is [LGPL--3.0--or--later](https://github.com/AngaBlue/exe/blob/master/LICENSE) licensed.
