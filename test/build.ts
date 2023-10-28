import { join } from 'path';
import exe from '../src';

const build = exe({
    entry: join(__dirname, 'index.js'),
    out: join(__dirname, 'My Cool App.exe'),
    pkg: ['-C', 'GZip'], // Specify extra pkg arguments
    version: '2.4.2',
    target: 'latest-win-x64',
    icon: join(__dirname, 'icon.ico'), // Application icons must be in .ico format
    executionLevel: 'asInvoker',
    properties: {
        FileDescription: 'My Cool App',
        ProductName: 'My Cool App',
        LegalCopyright: 'AngaBlue https://anga.blue',
        OriginalFilename: 'AngaBlue'
    }
});

build.then(() => console.log('Build completed!'));
