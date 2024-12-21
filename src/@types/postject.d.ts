declare module 'postject' {
	interface Options {
		machoSegmentName?: string;
		overwrite?: boolean;
		sentinelFuse?: string;
	}

	export function inject(filename: string, resourceName: string, resourceData: Buffer, options?: Options): Promise<void>;
}
