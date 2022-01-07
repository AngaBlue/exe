interface Properties {
    FileDescription: string;
    ProductName: string;
    CompanyName: string;
    LegalCopyright: string;
}

export interface Options {
    /** The entry file. */
    entry: string;
    /** The pkg build target */
    target: string;
    /** The output file. */
    out: string;
    /** The pkg argument string. */
    pkg: string[];
    /** The metadata within a version-information resource. */
    properties?: Properties;
    /**
     * See [MSDN](https://docs.microsoft.com/en-us/windows/win32/msi/version) for the version format.
     */
    version?: string;
    /**
     * Absolute path to the [ICO-formatted icon](https://en.wikipedia.org/wiki/ICO_(file_format))
     * to set as the application's icon.
     */
    icon?: string;
}
