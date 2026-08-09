/**
 * Clawd Code — TRADE MODE
 * Perpetuals trading with Phoenix + Vulcan CLI + Helius RPC
 * Default model for AI analysis: xAI Grok 4.3 (grok-4.3).
 */
export declare class TradeMode {
    private config;
    constructor(config: any);
    run(args: string[]): Promise<void>;
    private getVulcanCommand;
    private buildVulcanArgs;
    private runVulcanCommand;
    private fetchFundingRates;
    private fetchFundingRatesViaHelius;
    private fetchTicker;
    private fetchOrderbook;
    private executeShort;
    private executeLong;
    private scanMarkets;
    private showPosition;
    private paperTrade;
    private showStatus;
}
//# sourceMappingURL=trade.d.ts.map