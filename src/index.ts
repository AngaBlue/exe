import pkg from 'pkg';
import rcedit from 'rcedit';
import { Options } from './Options';

async function exe(options: Options) {
    const args = [options.entry, ...options.pkg, '-t', options.target, '-o', options.out];

    // Build w/ PKG
    pkg(args);

    // Modify EXE w/ RCEdit
    await rcedit(options.out, {
        'application-manifest': options.manifest,
        'file-version': options.fileVersion,
        'product-version': options.productVersion,
        'requested-execution-level': options.executionLevel,
        'version-string': options.version,
        icon: options.icon
    });
}

export default exe;
