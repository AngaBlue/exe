#!/usr/bin/env node

import { resolve } from 'path';
import { readFile } from 'fs/promises';
import exe from '.';

declare interface Error {
    name: string;
    message: string;
    stack?: string;
    code?: number | string;
}

/**
 * Exit the process with an error message and usage.
 * @param err The error message to display.
 */
function exitWithError(err: string) {
    console.error(err);
    console.error('');
    console.error('Usage: exe [exe.json]');
    process.exit(1);
}

(async function main() {
    const args = process.argv.splice(2);

    try {
        const exeJsonPath = resolve(args[0] || 'exe.json');
        const exeJson = await readFile(exeJsonPath);
        const exeConfig = JSON.parse(String(exeJson));
        await exe(exeConfig);
    } catch (err) {
        if ((err as Error).code === 'ENOENT') return exitWithError(`File not found: ${args[0]}`);
        return exitWithError((err as Error).message);
    }

    process.exit(0);
})();
