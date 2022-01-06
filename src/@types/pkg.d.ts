declare module 'pkg' {
    function exec(args: string[]): Promise<void>;
    // eslint-disable-next-line import/prefer-default-export
    export { exec };
}
