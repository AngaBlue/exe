import { RequestedExecutionLevel, VersionStringOptions } from 'rcedit';

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
    properties?: VersionStringOptions;
    /**
     * See [MSDN](https://docs.microsoft.com/en-us/windows/win32/msi/version) for the version format.
     */
    fileVersion?: string;
    /**
     * See [MSDN](https://docs.microsoft.com/en-us/windows/win32/msi/version) for the version format.
     */
    productVersion?: string;
    /**
     * Absolute path to the [ICO-formatted icon](https://en.wikipedia.org/wiki/ICO_(file_format))
     * to set as the application's icon.
     */
    icon?: string;
    /** See [MSDN](https://docs.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel) for details. */
    executionLevel: RequestedExecutionLevel;
    /**
     * The path to the [application manifest](https://docs.microsoft.com/en-us/windows/win32/sbscs/application-manifests)
     * XML that is to be embedded in the EXE.
     */
    manifest: string;
}
