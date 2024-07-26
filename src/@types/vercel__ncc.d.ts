declare module '@vercel/ncc' {
    interface NCCOptions {
        cache?: string | boolean;
        externals?: string[];
        filterAssetBase?: string;
        minify?: boolean;
        sourceMap?: boolean;
        assetBuilds?: boolean;
        sourceMapBasePrefix?: string;
        sourceMapRegister?: boolean;
        watch?: boolean;
        license?: string;
        target?: string;
        v8cache?: boolean;
        quiet?: boolean;
        debugLog?: boolean;
    }

    interface NCCResult {
        code: string;
        map: string;
        assets: { [filePath: string]: { source: string | Buffer; permissions: number; symlinks: boolean } };
    }

    export default function ncc(input: string, options?: NCCOptions): Promise<NCCResult>;
}
