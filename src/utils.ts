import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const signtoolPackagePath = require.resolve('signtool');

export const execAsync = promisify(exec);

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

export function signtool(args: string[]) {
    const signtoolPath = getSigntoolPath();
    return execAsync(`${signtoolPath} ${args.join(' ')}`);
}
