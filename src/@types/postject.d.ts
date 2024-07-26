declare module 'postject' {
    interface Options {
        machoSegmentName?: string;
        overwrite?: boolean;
        sentinelFuse?: string;
    }

    // eslint-disable-next-line import/prefer-default-export
    export function inject(filename: string, resourceName: string, resourceData: Buffer, options?: Options): Promise<void>;
}
