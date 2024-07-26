import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const signtoolPackagePath = require.resolve('signtool');

export const execAsync = promisify(exec);

/**
 * Get the path to the signtool executable.
 * @returns The path to the signtool executable.
 */
function getSigntoolPath() {
    const signtoolPath = path.dirname(signtoolPackagePath);
    switch (process.arch) {
        case 'ia32':
            return path.join(signtoolPath, 'signtool', 'x86', 'signtool.exe').replace(/\\/g, '/');

        case 'x64':
            return path.join(signtoolPath, 'signtool', 'x64', 'signtool.exe').replace(/\\/g, '/');

        case 'arm':
        default:
            throw new Error('Signtool is not supported in this environment');
    }
}

/**
 * Sign a file using signtool.
 * @param args Arguments to pass to signtool.
 * @returns A promise that resolves when the file is signed.
 */
export function signtool(args: string[]) {
    const signtoolPath = getSigntoolPath();
    return execAsync(`${signtoolPath} ${args.join(' ')}`);
}

export const warningSuppression =
    "const originalError=console.error;console.error=(msg,...args)=>{if(typeof msg==='string'&&msg.includes('Single executable application is an experimental feature and might change at any time')||msg.includes('Currently the require() provided to the main script embedded into single-executable applications only supports loading built-in modules.'))return;originalError(msg,...args);};";
