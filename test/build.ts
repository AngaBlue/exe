import exe from '../src';

const build = exe({
    entry: './test/index.js',
    out: './test/My Cool App.exe',
    pkg: ['-C', 'GZip'], // Specify extra pkg arguments
    version: '2.4.2',
    target: 'latest-win-x64',
    icon: './test/icon.ico', // Application icons must be in .ico format
    properties: {
        FileDescription: 'My Cool App',
        ProductName: 'My Cool App',
        LegalCopyright: 'AngaBlue https://anga.blue',
        OriginalFilename: 'AngaBlue'
    }
});

build.then(() => console.log('Build completed!'));
