import { exec } from 'pkg';
import * as ResEdit from 'resedit';
import { readFileSync, writeFileSync } from 'fs';
import { VersionStringValues } from 'resedit/dist/resource';
import { Options } from './Options';

// Language code for en-us and encoding codepage for UTF-16
const language = {
    lang: 1033, // en-us
    codepage: 1200 // UTF-16
};

/**
 * Build an executable
 * @param {Options} options
 * @returns An empty promise which is resolved when the executable is built
 */
async function exe(options: Options): Promise<void> {
    const args = [options.entry, ...(options.pkg ?? []), '-t', options.target ?? 'latest-win-x64', '-o', options.out];

    // Build w/ PKG
    await exec(args);

    // Modify .exe w/ ResEdit
    const data = readFileSync(options.out);
    const executable = ResEdit.NtExecutable.from(data);
    const res = ResEdit.NtExecutableResource.from(executable);
    const vi = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0];

    // Remove original filename
    vi.removeStringValue(language, 'OriginalFilename');
    vi.removeStringValue(language, 'InternalName');

    // Product version
    if (options.version) {
        // Convert version to tuple of 4 numbers
        const version = `${options.version}.0`
            .split('.')
            .map(v => Number(v) ?? 0)
            .slice(0, 4) as [number, number, number, number];

        // Update versions
        vi.setProductVersion(...version, language.lang);
        vi.setFileVersion(...version, language.lang);
    }

    // Add additional user specified properties
    if (options.properties) {
        vi.setStringValues(language, options.properties as unknown as VersionStringValues);
    }

    vi.outputToResourceEntries(res.entries);

    // Add icon
    if (options.icon) {
        const iconFile = ResEdit.Data.IconFile.from(readFileSync(options.icon));
        ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
            res.entries,
            1,
            language.lang,
            iconFile.icons.map(item => item.data)
        );
    }

    // Regenerate and write to .exe
    res.outputResource(executable);
    writeFileSync(options.out, Buffer.from(executable.generate()));
}

export = exe;
