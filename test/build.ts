import { execSync } from 'node:child_process';
import { join } from 'node:path';
import exe from '../src';

const start = Date.now();

const build = exe({
	entry: join(__dirname, 'index.js'),
	out: join(__dirname, 'My Cool App.exe'),
	skipBundle: false,
	version: '2.4.2',
	icon: join(__dirname, 'icon.ico'), // Application icons must be in .ico format
	executionLevel: 'asInvoker',
	properties: {
		FileDescription: 'My Cool App',
		ProductName: 'My Cool App',
		LegalCopyright: 'AngaBlue https://anga.blue',
		OriginalFilename: 'AngaBlue'
	}
});

build.then(() => {
	console.log(`Build completed in ${Date.now() - start}ms`);
	console.log(execSync(`"${join(__dirname, 'My Cool App.exe')}"`).toString());
});
