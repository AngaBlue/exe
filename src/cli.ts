import { resolve } from 'path';
import { readFile } from 'fs/promises';
import exe from '.';

(async function main() {
    const args = process.argv.splice(2);
    if (args.length !== 1) {
        console.log('Usage: exe <exe.json>');
        process.exit(1);
    }

    const exeJsonPath = resolve(args[0]);
    const exeJson = await readFile(exeJsonPath);
    const exeConfig = JSON.parse(String(exeJson));
    await exe(exeConfig);
    process.exit(0);
})();
