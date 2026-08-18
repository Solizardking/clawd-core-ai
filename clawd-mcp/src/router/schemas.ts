import { z } from 'zod';
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
} from './actions.js';
import { withTelemetry } from './telemetry.js';

const detailField = z.enum(['summary', 'standard', 'full']).optional();
const argsField = z.union([
  z.object({}).passthrough(),
  z.string().transform((s, ctx) => {
    try { return JSON.parse(s); } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'args must be a JSON object string' });
      return z.NEVER;
    }
  }).pipe(z.object({}).passthrough()),
]).optional();

const stringArray = () => z.array(z.string()).optional();
const optionalString = () => z.string().optional();
const optionalNumber = () => z.coerce.number().optional();
const optionalBoolean = () => z.boolean().optional();

export const HeliusAccountActionSchema = z.enum(HELIUS_ACCOUNT_ACTIONS);
export const HeliusWalletActionSchema = z.enum(HELIUS_WALLET_ACTIONS);
export const HeliusAssetActionSchema = z.enum(HELIUS_ASSET_ACTIONS);
export const HeliusTransactionActionSchema = z.enum(HELIUS_TRANSACTION_ACTIONS);
export const HeliusChainActionSchema = z.enum(HELIUS_CHAIN_ACTIONS);
export const HeliusStreamingActionSchema = z.enum(HELIUS_STREAMING_ACTIONS);
export const HeliusKnowledgeActionSchema = z.enum(HELIUS_KNOWLEDGE_ACTIONS);
export const HeliusWriteActionSchema = z.enum(HELIUS_WRITE_ACTIONS);
export const HeliusCompressionActionSchema = z.enum(HELIUS_COMPRESSION_ACTIONS);

export const HELIUS_ACCOUNT_SCHEMA = withTelemetry({
  action: HeliusAccountActionSchema,
  detail: detailField,
  args: argsField,
  apiKey: optionalString(),
  network: optionalString(),
  paymentIntentId: optionalString(),
  plan: optionalString(),
  period: optionalString(),
  couponCode: optionalString(),
  email: optionalString(),
  firstName: optionalString(),
  lastName: optionalString(),
  discoveryPath: optionalString(),
  frictionPoints: optionalString(),
});

export const HELIUS_WALLET_SCHEMA = withTelemetry({
  action: HeliusWalletActionSchema,
  detail: detailField,
  args: argsField,
  address: optionalString(),
  addresses: stringArray(),
  limit: optionalNumber(),
  page: optionalNumber(),
  cursor: optionalString(),
  before: optionalString(),
  after: optionalString(),
  showNfts: optionalBoolean(),
  showZeroBalance: optionalBoolean(),
  showNative: optionalBoolean(),
});

export const HELIUS_ASSET_SCHEMA = withTelemetry({
  action: HeliusAssetActionSchema,
  detail: detailField,
  args: argsField,
  id: optionalString(),
  ids: stringArray(),
  address: optionalString(),
  ownerAddress: optionalString(),
  creatorAddress: optionalString(),
  authorityAddress: optionalString(),
  groupKey: optionalString(),
  groupValue: optionalString(),
  mint: optionalString(),
  limit: optionalNumber(),
  page: optionalNumber(),
  name: optionalString(),
  compressed: optionalBoolean(),
  burnt: optionalBoolean(),
  frozen: optionalBoolean(),
  onlyVerified: optionalBoolean(),
});

export const HELIUS_TRANSACTION_SCHEMA = withTelemetry({
  action: HeliusTransactionActionSchema,
  detail: detailField,
  args: argsField,
  address: optionalString(),
  signature: optionalString(),
  signatures: stringArray(),
  limit: optionalNumber(),
  before: optionalString(),
  until: optionalString(),
  paginationToken: optionalString(),
  sortOrder: optionalString(),
  status: optionalString(),
  mode: optionalString(),
  transactionDetails: optionalString(),
  tokenAccounts: optionalString(),
});

export const HELIUS_CHAIN_SCHEMA = withTelemetry({
  action: HeliusChainActionSchema,
  detail: detailField,
  args: argsField,
  address: optionalString(),
  addresses: stringArray(),
  programId: optionalString(),
  slot: optionalNumber(),
  limit: optionalNumber(),
  page: optionalNumber(),
  stakeAccount: optionalString(),
  accountKeys: stringArray(),
  priorityLevel: optionalString(),
  includeAllLevels: optionalBoolean(),
  encoding: optionalString(),
  dataSize: optionalNumber(),
  owner: optionalString(),
  mint: optionalString(),
});

export const HELIUS_STREAMING_SCHEMA = withTelemetry({
  action: HeliusStreamingActionSchema,
  detail: detailField,
  args: argsField,
  account: optionalString(),
  accountAddresses: stringArray(),
  webhookID: optionalString(),
  webhookURL: optionalString(),
  transactionTypes: stringArray(),
  signature: optionalString(),
  encoding: optionalString(),
  commitment: optionalString(),
  region: optionalString(),
  webhookType: optionalString(),
  accountInclude: stringArray(),
  accountExclude: stringArray(),
  accountRequired: stringArray(),
  subscribeAccounts: stringArray(),
  accountOwners: stringArray(),
  transactionAccountInclude: stringArray(),
  transactionAccountExclude: stringArray(),
  transactionAccountRequired: stringArray(),
});

export const HELIUS_KNOWLEDGE_SCHEMA = withTelemetry({
  action: HeliusKnowledgeActionSchema,
  detail: detailField,
  args: argsField,
  topic: optionalString(),
  section: optionalString(),
  query: optionalString(),
  slug: optionalString(),
  number: optionalString(),
  path: optionalString(),
  category: optionalString(),
  repo: optionalString(),
  branch: optionalString(),
  description: optionalString(),
  budget: optionalString(),
  complexity: optionalString(),
  scale: optionalString(),
  remember: optionalBoolean(),
  errorCode: optionalString(),
});

export const HELIUS_WRITE_SCHEMA = withTelemetry({
  action: HeliusWriteActionSchema,
  detail: detailField,
  args: argsField,
  recipientAddress: optionalString(),
  mintAddress: optionalString(),
  amount: optionalNumber(),
  sendMax: optionalBoolean(),
  stakeAccount: optionalString(),
  destination: optionalString(),
  owsWallet: optionalString(),
});

export const HELIUS_COMPRESSION_SCHEMA = withTelemetry({
  action: HeliusCompressionActionSchema,
  detail: detailField,
  args: argsField,
  address: optionalString(),
  addresses: stringArray(),
  hash: optionalString(),
  hashes: stringArray(),
  owner: optionalString(),
  delegate: optionalString(),
  mint: optionalString(),
  limit: optionalNumber(),
  cursor: optionalString(),
});

// ── SOL GPT catalog schemas ──────────────────────────────────────────────
// Generic shape: action + detail + a passthrough `args` bag, plus a handful
// of common named fields as hints. Individual action handlers pull whatever
// keys they need out of the merged params (see dispatch.ts buildActionParams).

export const PhoenixActionSchema = z.enum(PHOENIX_ACTIONS);
export const ImperialActionSchema = z.enum(IMPERIAL_ACTIONS);
export const SolGptMarketActionSchema = z.enum(SOL_GPT_MARKET_ACTIONS);
export const SolGptOhlcvActionSchema = z.enum(SOL_GPT_OHLCV_ACTIONS);
export const SolGptWalletActionSchema = z.enum(SOL_GPT_WALLET_ACTIONS);
export const SolanaTrackerActionSchema = z.enum(SOLANA_TRACKER_ACTIONS);
export const SolGptTradingActionSchema = z.enum(SOL_GPT_TRADING_ACTIONS);
export const SolGptPredictionActionSchema = z.enum(SOL_GPT_PREDICTION_ACTIONS);
export const SolGptBrowserActionSchema = z.enum(SOL_GPT_BROWSER_ACTIONS);
export const SolGptAgentsActionSchema = z.enum(SOL_GPT_AGENTS_ACTIONS);

const solGptCommonFields = {
  detail: detailField,
  args: argsField,
  symbol: optionalString(),
  mint: optionalString(),
  address: optionalString(),
  wallet: optionalString(),
  owner: optionalString(),
  market: optionalString(),
  ticker: optionalString(),
  timeframe: optionalString(),
  limit: optionalNumber(),
  page: optionalNumber(),
  cursor: optionalString(),
};

export const PHOENIX_SCHEMA = withTelemetry({
  action: PhoenixActionSchema,
  ...solGptCommonFields,
  side: optionalString(),
  baseUnits: optionalNumber(),
  priceUsd: optionalNumber(),
  subaccount: optionalNumber(),
});

export const IMPERIAL_SCHEMA = withTelemetry({
  action: ImperialActionSchema,
  ...solGptCommonFields,
  asset: optionalString(),
  venue: optionalString(),
  underwriter: optionalString(),
  notional: optionalNumber(),
  period: optionalString(),
  grouping: optionalString(),
});

export const SOL_GPT_MARKET_SCHEMA = withTelemetry({
  action: SolGptMarketActionSchema,
  ...solGptCommonFields,
  query: optionalString(),
});

export const SOL_GPT_OHLCV_SCHEMA = withTelemetry({
  action: SolGptOhlcvActionSchema,
  ...solGptCommonFields,
  baseMint: optionalString(),
  quoteMint: optionalString(),
  pairAddress: optionalString(),
  type: optionalString(),
  timeFrom: optionalNumber(),
  timeTo: optionalNumber(),
});

export const SOL_GPT_WALLET_SCHEMA = withTelemetry({
  action: SolGptWalletActionSchema,
  ...solGptCommonFields,
});

export const SOLANA_TRACKER_SCHEMA = withTelemetry({
  action: SolanaTrackerActionSchema,
  ...solGptCommonFields,
  tokenAddress: optionalString(),
  walletAddress: optionalString(),
  poolAddress: optionalString(),
  poolId: optionalString(),
  mints: stringArray(),
  method: optionalString(),
  params: argsField,
  priceChanges: optionalBoolean(),
});

export const SOL_GPT_TRADING_SCHEMA = withTelemetry({
  action: SolGptTradingActionSchema,
  ...solGptCommonFields,
  inputMint: optionalString(),
  outputMint: optionalString(),
  amount: optionalNumber(),
  slippageBps: optionalNumber(),
  destination: optionalString(),
});

export const SOL_GPT_PREDICTION_SCHEMA = withTelemetry({
  action: SolGptPredictionActionSchema,
  ...solGptCommonFields,
  query: optionalString(),
});

export const SOL_GPT_BROWSER_SCHEMA = withTelemetry({
  action: SolGptBrowserActionSchema,
  ...solGptCommonFields,
  task: optionalString(),
  sessionId: optionalString(),
  keepAlive: optionalBoolean(),
  url: optionalString(),
});

export const SOL_GPT_AGENTS_SCHEMA = withTelemetry({
  action: SolGptAgentsActionSchema,
  ...solGptCommonFields,
  id: optionalString(),
});

export const EXPAND_RESULT_SCHEMA = withTelemetry({
  resultId: z.string(),
  section: optionalString(),
  item: optionalNumber(),
  page: optionalNumber(),
  range: optionalString(),
  continuation: optionalString(),
  detail: detailField,
});
