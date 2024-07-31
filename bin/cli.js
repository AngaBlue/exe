#!/usr/bin/env node

const { promises: fs } = require('fs');
const path = require('path');
const exe = require('..');
const packageJson = require('../package.json');

// package.json
const { name: packageName, version: packageVersion } = packageJson;

(async function main() {
    console.log('');
    console.log(`${packageName} ${packageVersion}`);
    console.log('');

    const args = process.argv.splice(2);
    if (args.length !== 1) {
        console.log('Usage: exe <path-to: config-exe.json>');
        console.log('');
        process.exit(1);
    }

    const exeJsonPath = path.resolve(args[0]);
    const exeJson = await fs.readFile(exeJsonPath);
    const exeConfig = JSON.parse(exeJson);
    const start = Date.now();
    await exe(exeConfig);
    console.log(`Build completed in ${Date.now() - start}ms`);
    // Don't run the exe in this case since it's a CLI

    process.exit(0);
})();
