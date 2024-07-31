import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Options } from './Options';

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
    return execAsync(`"${signtoolPath}" ${args.join(' ')}`);
}

export const warningSuppression =
    "const originalError=console.error;console.error=(msg,...args)=>{if(typeof msg==='string'&&msg.includes('Single executable application is an experimental feature and might change at any time')||msg.includes('Currently the require() provided to the main script embedded into single-executable applications only supports loading built-in modules.'))return;originalError(msg,...args);};";

/**
 * Replace package:(name|version|author) with the value from the data object.
 * Example 1: "package:name" will be replaced with the name from the package.json file.
 * Example 2: "package:author.name" will be replaced with the author.name from the package.json file.
 *
 * @param value string to parse
 * @param data object to use for replacement
 * @returns updated value
 */
function parseValue(value: string, data: any) {
    // https://regex101.com/r/AvVwrD/2
    const regex = /(package:(?<prop>[a-z]+)(\.(?<subprop>[a-z]+))?)/gi;
    const match = regex.exec(value);
    if (match?.groups?.prop) {
        let dataVal = data[match?.groups?.prop];
        if (match?.groups?.subprop) {
            dataVal = data[match?.groups?.prop][match?.groups?.subprop];
        }
        return value.replace(regex, dataVal);
    }
    return value;
}

/**
 * Replace package tokens in option values with their actual values from the cwd package.json file.
 * @param {Options} options
 * @returns A new options object with the tokens replaced.
 */
export async function parseOptions(options: Options) {
    const { properties, ...rest } = options;

    try {
        const packageJsonPath = path.resolve(process.cwd(), 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

        const newOptions: { [key: string]: any } = {
            properties: {}
        };
        for (const key in rest) {
            if (typeof rest[key] === 'string') {
                newOptions[key] = parseValue(rest[key], packageJson);
            }
        }
        for (const key in properties) {
            if (typeof properties[key] === 'string') {
                newOptions.properties[key] = parseValue(properties[key], packageJson);
            }
        }
        return newOptions;
    } catch (err) {
        // If the package.json file is not found, return the original options
    }

    return options;
}
