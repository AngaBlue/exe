import { promises as fs } from 'fs';
import { type ResEdit, load } from 'resedit/cjs';
import { VersionStringValues } from 'resedit/dist/resource';
import { inject } from 'postject';
import { resolve } from 'path';
import ncc from '@vercel/ncc';
import { execAsync, signtool, warningSuppression } from './utils';
import type { Options } from './Options';

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
async function exe(options: Options) {
    // Build w/ Node - Single Executable Application
    // https://nodejs.org/api/single-executable-applications.html
    // Replace backslashes with forward slashes to avoid escaping issues
    const out = options.out.replace(/\\/g, '/');
    const bundle = `${out}.bundle.js`;
    const seaConfig = `${out}.sea-config.json`;
    const seaBlob = `${out}.blob`;

    let code = '';
    if (options.skipBundle) {
        // Use the entry file as is
        code = await fs.readFile(resolve(options.entry), 'utf8');
    } else {
        // Bundle with ncc
        const output = await ncc(resolve(options.entry), {
            minify: true,
            quiet: true,
            target: 'es2021'
        });

        code = output.code;
    }

    // Write the bundled code to a file and prepend the SEA require() warning suppression
    const pattern = /^#!.*\n/;
    const match = code.match(pattern);
    if (match) {
        // Shebang found, insert after the shebang
        code = `${match[0]}${warningSuppression}${code.slice(match[0].length)}`;
    } else {
        // No shebang, prepend at the beginning
        code = `${warningSuppression}${code}`;
    }

    await fs.writeFile(bundle, code);

    // Write sea-config.json
    await fs.writeFile(
        seaConfig,
        JSON.stringify(
            {
                main: bundle,
                output: seaBlob,
                disableExperimentalSEAWarning: true
            },
            null,
            2
        )
    );

    // Generate blob
    await execAsync(`node --experimental-sea-config "${seaConfig}"`);

    // Generate .exe
    await fs.copyFile(process.execPath, out);

    // Remove the signature
    await signtool(['remove', '/s', `"${out}"`]);

    // Inject blob into .exe
    const seaBlobData = await fs.readFile(seaBlob);
    await inject(out, 'NODE_SEA_BLOB', Buffer.from(seaBlobData), { sentinelFuse: 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2' });

    // Remove temporary files
    await fs.unlink(bundle);
    await fs.unlink(seaConfig);
    await fs.unlink(seaBlob);

    // Modify .exe w/ ResEdit
    const RE: typeof ResEdit = await load();
    const data = await fs.readFile(options.out);
    const executable = RE.NtExecutable.from(data);
    const res = RE.NtExecutableResource.from(executable);
    const vi = RE.Resource.VersionInfo.fromEntries(res.entries)[0];

    // Remove original filename
    vi.removeStringValue(language, 'OriginalFilename');
    vi.removeStringValue(language, 'InternalName');

    // Product version
    if (options.version) {
        // Convert version to tuple of 3 numbers
        const version = options.version
            .split('.')
            .map(v => Number(v) || 0)
            .slice(0, 3) as [number, number, number];

        // Update versions
        vi.setProductVersion(...version, 0, language.lang);
        vi.setFileVersion(...version, 0, language.lang);
    }

    // Add additional user specified properties
    if (options.properties) {
        vi.setStringValues(language, options.properties as unknown as VersionStringValues);
    }

    vi.outputToResourceEntries(res.entries);

    // Add icon
    if (options.icon) {
        const iconFile = RE.Data.IconFile.from(await fs.readFile(options.icon));
        RE.Resource.IconGroupEntry.replaceIconsForResource(
            res.entries,
            1,
            language.lang,
            iconFile.icons.map(item => item.data)
        );
    }

    // Execution level
    const level = options.executionLevel || 'asInvoker';
    const manifest = res.getResourceEntriesAsString(24, 1)[0][1];
    res.replaceResourceEntryFromString(24, 1, language.lang, manifest.replace('asInvoker', level));

    // Regenerate and write to .exe
    res.outputResource(executable);
    await fs.writeFile(options.out, Buffer.from(executable.generate()));
}

export = exe;
