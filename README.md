<h1 align="center">Node.js Windows Executable</h1>
<p align="center">
    <a href="https://github.com/AngaBlue/exe/packages/1108141" target="_blank">
  <img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/AngaBlue/exe?label=Version">
  </a>
  <a href="https://github.com/AngaBlue/exe/blob/master/LICENSE" target="_blank">
    <img alt="License: LGPL--3.0--or--later" src="https://img.shields.io/github/license/AngaBlue/exe?color=green" />
  </a>
</p>

Build a portable binary for Windows systems using Vercel's [pkg](https://www.npmjs.com/package/pkg).  As [pkg](https://www.npmjs.com/package/pkg) doesn't support modifying executable properties, this project serves to and aid in automating modifying the executable properties post build.

### 🏠 [Homepage](https://github.com/AngaBlue/exe)

## Install

Install this package using your package manager of choice.
```sh
 npm i @angablue/exe
```
or
```sh
 yarn add @angablue/exe
```
## Basic Usage
```js
// build.js
const exe = require('@angablue/exe');

const build = exe({
    entry: './index.js',
    out: './build/My Cool App.exe',
});

build.then(() => console.log('Build completed!'));
```

## Example Usage
Specify more arguments and completely customise the resultant executable.
```js
// build.js
const exe = require('@angablue/exe');

const build = exe({
    entry: './index.js',
    out: './build/My Cool App.exe',
    pkg: ['-C', 'GZip'], // Specify extra pkg arguments
    version: '2.4.2',
    target: 'latest-win-x64',
    icon: './assets/icon.ico', // Application icons must be in .ico format
    properties: {
        FileDescription: 'My Cool App',
        ProductName: 'My Cool App',
        LegalCopyright: 'AngaBlue https://anga.blue',
        OriginalFilename: 'My Cool App.exe'
    }
});

build.then(() => console.log('Build completed!'));
```
## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © [AngaBlue](https://github.com/AngaBlue).<br />
This project is [LGPL--3.0--or--later](https://github.com/AngaBlue/exe/blob/master/LICENSE) licensed.
