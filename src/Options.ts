interface Properties {
    FileDescription: string;
    ProductName: string;
    OriginalFilename: string;
    LegalCopyright: string;
}

type ExecutionLevel = 'asInvoker' | 'highestAvailable' | 'requireAdministrator';

export interface Options {
    /**
     * The entry file.
     */
    entry: string;
    /**
     * The output file.
     */
    out: string;
    /**
     * The pkg argument string.
     */
    pkg?: string[];
    /**
     * The pkg build target
     * */
    target?: string;
    /**
     * The metadata within a version-information resource.
     * */
    properties?: Properties;
    /**
     * See [MSDN](https://docs.microsoft.com/en-us/windows/win32/msi/version) for the version format.
     */
    version?: `${number}.${number}.${number}`;
    /**
     * Absolute path to the [ICO-formatted icon](https://en.wikipedia.org/wiki/ICO_(file_format))
     * to set as the application's icon.
     */
    icon?: string;
    /**
     * The execution level that determines how UAC behaves when the executable is run.
     */
    executionLevel?: ExecutionLevel;
}
