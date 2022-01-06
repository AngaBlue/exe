import { exec } from 'pkg';
import rcedit from 'rcedit';
import { Options } from './Options';

async function exe(options: Options) {
    const args = [options.entry, ...options.pkg, '-t', options.target, '-o', options.out];

    // Build w/ PKG
    await exec(args);

    // Modify EXE w/ RCEdit
    rcedit(options.out, {
        'application-manifest': options.manifest,
        'file-version': options.fileVersion,
        'product-version': options.productVersion,
        'requested-execution-level': options.executionLevel,
        'version-string': options.properties,
        icon: options.icon
    });
}

export = exe;
