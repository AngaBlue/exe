import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { Options } from './Options';

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

type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue>;
type JSONObject = Record<string, JSONValue>;

/**
 * Recursively replaces package:(name|version|author) with the value from the reference object.
 * Example 1: "{package:name}" will be replaced with the `name` field from the package.json file.
 * Example 2: "{package:author.name}" will be replaced with the `author`.`name` field from the package.json file.
 *
 * @param data The object to operate over.
 * @param reference The object to use for replacement.
 * @returns The updated value (modified in-place).
 */
function parseObject<T extends JSONObject, Reference extends JSONObject>(data: T, reference: Reference): T {
	for (const [key, value] of Object.entries(data)) {
		switch (typeof value) {
			case 'string': {
				// https://regex101.com/r/AvVwrD/3
				const regex = /\{(package:(?<prop>[a-z]+)(\.(?<subProp>[a-z]+))?)\}/gi;
				const match = regex.exec(value);
				const { prop, subProp }: { prop?: keyof Reference; subProp?: keyof Reference[keyof Reference] } = match?.groups || {};

				// Extract the property/sub-property
				if (prop && reference[prop]) {
					if (subProp && reference[prop][subProp])
						data[key as keyof T] = value.replace(regex, reference[prop][subProp] as string) as T[keyof T];
					else data[key as keyof T] = value.replace(regex, reference[prop] as string) as T[keyof T];
				}
				break;
			}
			case 'object': {
				// Recurse if the value is another object
				if (value && !Array.isArray(value)) data[key as keyof T] = parseObject(value, reference) as T[keyof T];
				break;
			}
		}
	}

	return data;
}

/**
 * Replace package tokens in option values with their actual values from the cwd package.json file.
 * @param {Options} options
 * @returns A new options object with the tokens replaced.
 */
export async function parseOptions(options: Options) {
	try {
		const packageJSONPath = path.resolve(process.cwd(), 'package.json');
		const packageJSON = JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));

		// Parse object modified options in-place
		parseObject(options as unknown as JSONObject, packageJSON);
	} catch (_err) {
		// If the package.json cannot be loaded, return the original options
	}

	return options;
}
