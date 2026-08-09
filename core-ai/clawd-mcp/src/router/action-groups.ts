import {
  HELIUS_ACCOUNT_ACTIONS,
  HELIUS_ASSET_ACTIONS,
  HELIUS_CHAIN_ACTIONS,
  HELIUS_COMPRESSION_ACTIONS,
  HELIUS_KNOWLEDGE_ACTIONS,
  HELIUS_STREAMING_ACTIONS,
  HELIUS_TRANSACTION_ACTIONS,
  HELIUS_WALLET_ACTIONS,
  HELIUS_WRITE_ACTIONS,
  IMPERIAL_ACTIONS,
  PHOENIX_ACTIONS,
  SOL_GPT_AGENTS_ACTIONS,
  SOL_GPT_BROWSER_ACTIONS,
  SOL_GPT_MARKET_ACTIONS,
  SOL_GPT_OHLCV_ACTIONS,
  SOL_GPT_PREDICTION_ACTIONS,
  SOL_GPT_TRADING_ACTIONS,
  SOL_GPT_WALLET_ACTIONS,
  SOLANA_TRACKER_ACTIONS,
  type ActionName,
} from './actions.js';

export const PUBLIC_TOOL_NAMES = [
  'heliusAccount',
  'heliusWallet',
  'heliusAsset',
  'heliusTransaction',
  'heliusChain',
  'heliusStreaming',
  'heliusKnowledge',
  'heliusWrite',
  'heliusCompression',
  'solGptPhoenix',
  'solGptImperial',
  'solGptMarket',
  'solGptOhlcv',
  'solGptWallet',
  'solGptSolanaTracker',
  'solGptTrading',
  'solGptPrediction',
  'solGptBrowser',
  'solGptAgents',
  'expandResult',
] as const;

export type PublicToolName = typeof PUBLIC_TOOL_NAMES[number];
export type RoutedPublicToolName = Exclude<PublicToolName, 'expandResult'>;

export const ACTION_GROUPS: Record<RoutedPublicToolName, readonly ActionName[]> = {
  heliusAccount: HELIUS_ACCOUNT_ACTIONS,
  heliusWallet: HELIUS_WALLET_ACTIONS,
  heliusAsset: HELIUS_ASSET_ACTIONS,
  heliusTransaction: HELIUS_TRANSACTION_ACTIONS,
  heliusChain: HELIUS_CHAIN_ACTIONS,
  heliusStreaming: HELIUS_STREAMING_ACTIONS,
  heliusKnowledge: HELIUS_KNOWLEDGE_ACTIONS,
  heliusWrite: HELIUS_WRITE_ACTIONS,
  heliusCompression: HELIUS_COMPRESSION_ACTIONS,
  solGptPhoenix: PHOENIX_ACTIONS,
  solGptImperial: IMPERIAL_ACTIONS,
  solGptMarket: SOL_GPT_MARKET_ACTIONS,
  solGptOhlcv: SOL_GPT_OHLCV_ACTIONS,
  solGptWallet: SOL_GPT_WALLET_ACTIONS,
  solGptSolanaTracker: SOLANA_TRACKER_ACTIONS,
  solGptTrading: SOL_GPT_TRADING_ACTIONS,
  solGptPrediction: SOL_GPT_PREDICTION_ACTIONS,
  solGptBrowser: SOL_GPT_BROWSER_ACTIONS,
  solGptAgents: SOL_GPT_AGENTS_ACTIONS,
};

export function findPublicToolForAction(action: ActionName): RoutedPublicToolName {
  for (const [tool, actions] of Object.entries(ACTION_GROUPS) as Array<[RoutedPublicToolName, readonly ActionName[]]>) {
    if (actions.includes(action)) {
      return tool;
    }
  }

  throw new Error(`No public tool mapping found for action "${action}"`);
}
