import { exec } from 'pkg';
import * as ResEdit from 'resedit';
import { readFileSync, writeFileSync } from 'fs';
import { VersionStringValues } from 'resedit/dist/resource';
import { Options } from './Options';

/**
 * Build an executable
 * @param {Options} options
 * @returns An empty promise
 */
async function exe(options: Options): Promise<void> {
    const args = [options.entry, ...options.pkg, '-t', options.target, '-o', options.out];

    // Build w/ PKG
    await exec(args);

    // Modify EXE w/ ResEdit
    const data = readFileSync(options.out);
    const executable = ResEdit.NtExecutable.from(data);
    const res = ResEdit.NtExecutableResource.from(executable);
    const vi = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0];

    // Remove Original Filename
    vi.removeStringValue({ lang: 1033, codepage: 1200 }, 'OriginalFilename');
    vi.removeStringValue({ lang: 1033, codepage: 1200 }, 'InternalName');

    // Product Version
    if (options.version) {
        const version = `${options.version}.0`.split('.').map(v => Number(v) ?? 0);
        vi.setProductVersion(version[0], version[1], version[2], version[3], 1033);
        vi.setFileVersion(version[0], version[1], version[2], version[3], 1033);
    }

    // Properties
    if (options.properties) {
        vi.setStringValues({ lang: 1033, codepage: 1200 }, options.properties as unknown as VersionStringValues);
    }

    vi.outputToResourceEntries(res.entries);

    if (options.icon) {
        const iconFile = ResEdit.Data.IconFile.from(readFileSync(options.icon));
        ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
            res.entries,
            1,
            1033,
            iconFile.icons.map(item => item.data)
        );
    }

    // Regenerate and Write EXE
    res.outputResource(executable);
    writeFileSync(options.out, Buffer.from(executable.generate()));
}

export = exe;
