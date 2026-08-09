export type RouterContext = {
    sessionKey: string;
    network: 'mainnet-beta' | 'devnet';
};
export declare function getRouterContext(): RouterContext;
