import path from 'path';
import { exec } from 'child_process';

const signtoolPackagePath = require.resolve('signtool');

function execAsync(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, null, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function getSigntoolPath(): string {
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

function signtool(args: string[]): Promise<void> {
    const signtoolPath = getSigntoolPath();
    return execAsync(`${signtoolPath} ${args.join(' ')}`);
}

// eslint-disable-next-line import/prefer-default-export
export { execAsync, signtool };
