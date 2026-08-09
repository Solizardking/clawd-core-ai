export const HELIUS_ACCOUNT_ACTIONS = [
  'getStarted',
  'setHeliusApiKey',
  'generateKeypair',
  'signup',
  'getAccountStatus',
  'getAccountPlan',
  'getHeliusPlanInfo',
  'compareHeliusPlans',
  'previewUpgrade',
  'upgradePlan',
  'payRenewal',
  'purchaseCredits',
] as const;

export const HELIUS_WALLET_ACTIONS = [
  'getBalance',
  'getTokenBalances',
  'getWalletBalances',
  'getWalletHistory',
  'getWalletTransfers',
  'getWalletIdentity',
  'batchWalletIdentity',
  'getWalletFundedBy',
] as const;

export const HELIUS_ASSET_ACTIONS = [
  'getAsset',
  'getAssetsByOwner',
  'searchAssets',
  'getAssetsByGroup',
  'getAssetProof',
  'getAssetProofBatch',
  'getSignaturesForAsset',
  'getNftEditions',
  'getTokenHolders',
] as const;

export const HELIUS_TRANSACTION_ACTIONS = [
  'parseTransactions',
  'getTransactionHistory',
  'getTransfersByAddress',
] as const;

export const HELIUS_CHAIN_ACTIONS = [
  'getAccountInfo',
  'getTokenAccounts',
  'getProgramAccounts',
  'getBlock',
  'getNetworkStatus',
  'getPriorityFeeEstimate',
  'getStakeAccounts',
  'getWithdrawableAmount',
] as const;

export const HELIUS_STREAMING_ACTIONS = [
  'createWebhook',
  'getAllWebhooks',
  'getWebhookByID',
  'updateWebhook',
  'deleteWebhook',
  'transactionSubscribe',
  'accountSubscribe',
  'laserstreamSubscribe',
] as const;

export const HELIUS_KNOWLEDGE_ACTIONS = [
  'lookupHeliusDocs',
  'listHeliusDocTopics',
  'getHeliusCreditsInfo',
  'getRateLimitInfo',
  'troubleshootError',
  'recommendStack',
  'getSIMD',
  'listSIMDs',
  'searchSolanaDocs',
  'readSolanaSourceFile',
  'fetchHeliusBlog',
  'getPumpFunGuide',
  'getSenderInfo',
  'getWebhookGuide',
  'getLatencyComparison',
  'getEnhancedWebSocketInfo',
  'getLaserstreamInfo',
] as const;

export const HELIUS_WRITE_ACTIONS = [
  'transferSol',
  'transferToken',
  'stakeSOL',
  'unstakeSOL',
  'withdrawStake',
] as const;

export const HELIUS_COMPRESSION_ACTIONS = [
  'getCompressedAccount',
  'getCompressedAccountsByOwner',
  'getMultipleCompressedAccounts',
  'getCompressedBalance',
  'getCompressedBalanceByOwner',
  'getCompressedMintTokenHolders',
  'getCompressedTokenAccountBalance',
  'getCompressedTokenAccountsByOwner',
  'getCompressedTokenAccountsByDelegate',
  'getCompressedTokenBalancesByOwnerV2',
  'getCompressedAccountProof',
  'getMultipleCompressedAccountProofs',
  'getMultipleNewAddressProofs',
  'getCompressionSignaturesForAccount',
  'getCompressionSignaturesForAddress',
  'getCompressionSignaturesForOwner',
  'getCompressionSignaturesForTokenOwner',
  'getLatestCompressionSignatures',
  'getLatestNonVotingSignatures',
  'getTransactionWithCompressionInfo',
  'getValidityProof',
  'getIndexerHealth',
  'getIndexerSlot',
] as const;

// ── SOL GPT catalog actions ──────────────────────────────────────────────
// Proxied through the cheshireterminal.ai public REST API (see
// src/utils/cheshireTerminal.ts) rather than talking to Phoenix / Imperial /
// Solana Tracker / Birdeye / DFlow directly. Action names reuse the exact
// tool ids from the SOL GPT tool catalog (docs/tools.md) for traceability.

export const PHOENIX_ACTIONS = [
  'analyze_phoenix_account_health',
  'calculate_phoenix_position_margin',
  'get_phoenix_candles',
  'get_phoenix_exchange_snapshot',
  'get_phoenix_exchange_status',
  'get_phoenix_funding_overview',
  'get_phoenix_funding_rates',
  'get_phoenix_mark_price',
  'get_phoenix_market',
  'get_phoenix_market_calendar',
  'get_phoenix_market_fills',
  'get_phoenix_market_stats',
  'get_phoenix_my_trader_state',
  'get_phoenix_orderbook',
  'get_phoenix_rpc_context',
  'get_phoenix_trader',
  'list_phoenix_markets',
  'prepare_phoenix_cancel_all',
  'prepare_phoenix_deposit',
  'prepare_phoenix_limit_order',
  'prepare_phoenix_market_order',
  'prepare_phoenix_register_trader',
  'prepare_phoenix_withdraw',
] as const;

export const IMPERIAL_ACTIONS = [
  'get_imperial_builder_summary',
  'get_imperial_deposit_history',
  'get_imperial_flash_markets',
  'get_imperial_funding_history',
  'get_imperial_funding_rates',
  'get_imperial_gmtrade_funding_rates',
  'get_imperial_gmtrade_liquidity',
  'get_imperial_gmtrade_markets',
  'get_imperial_jupiter_pool_info',
  'get_imperial_mark_prices',
  'get_imperial_order_history',
  'get_imperial_order_history_detail',
  'get_imperial_orders',
  'get_imperial_passthrough_orders',
  'get_imperial_phoenix_depth',
  'get_imperial_phoenix_direct_positions',
  'get_imperial_phoenix_mark_prices',
  'get_imperial_phoenix_markets',
  'get_imperial_pnl_history',
  'get_imperial_positions',
  'get_imperial_priority_fee',
  'get_imperial_route',
  'get_imperial_stats_markets',
  'get_imperial_stats_open_interest',
  'get_imperial_stats_open_interest_history',
  'get_imperial_stats_summary',
  'get_imperial_stats_volume',
  'get_imperial_status',
  'get_imperial_touch_deals',
  'get_imperial_touch_markets',
  'get_imperial_touch_positions',
  'get_imperial_trades',
] as const;

export const SOL_GPT_MARKET_ACTIONS = [
  'get_birdeye_security',
  'get_creation_info',
  'get_holder_distribution',
  'get_meme_list',
  'get_meme_listings',
  'get_multi_price',
  'get_price',
  'get_smart_money',
  'get_token_fees',
  'get_token_markets',
  'get_token_overview',
  'get_token_security',
  'get_top_traders',
  'get_trending',
  'list_tokens',
  'resolve_token',
  'search_market_data',
  'search_tokens',
] as const;

export const SOL_GPT_OHLCV_ACTIONS = [
  'get_base_quote_chart',
  'get_base_quote_live_price',
  'get_chart',
  'get_history_price',
  'get_live_price',
  'get_live_txs',
  'get_net_worth_chart',
  'get_pair_chart',
  'get_pair_trades',
  'get_token_trades',
] as const;

export const SOL_GPT_WALLET_ACTIONS = [
  'get_net_worth',
  'get_pnl',
  'get_sol_balance',
  'get_wallet_assets',
] as const;

export const SOLANA_TRACKER_ACTIONS = [
  'st_das_get_asset',
  'st_das_get_asset_proof',
  'st_das_get_assets_by_authority',
  'st_das_get_assets_by_creator',
  'st_das_get_assets_by_group',
  'st_das_get_assets_by_owner',
  'st_das_get_nft_editions',
  'st_das_get_signatures_for_asset',
  'st_das_get_token_accounts',
  'st_das_search_assets',
  'st_get_chart',
  'st_get_first_buyers',
  'st_get_graduated_tokens',
  'st_get_graduating_tokens',
  'st_get_latest_tokens',
  'st_get_multi_tokens',
  'st_get_multiple_prices',
  'st_get_price',
  'st_get_price_history',
  'st_get_token',
  'st_get_token_bundlers',
  'st_get_token_events',
  'st_get_token_holders',
  'st_get_token_stats',
  'st_get_token_top_holders',
  'st_get_token_top_traders',
  'st_get_token_trades',
  'st_get_tokens_by_deployer',
  'st_get_tokens_by_volume',
  'st_get_top_performers',
  'st_get_top_traders',
  'st_get_trending_tokens',
  'st_get_wallet',
  'st_get_wallet_basic',
  'st_get_wallet_chart',
  'st_get_wallet_page',
  'st_get_wallet_pnl',
  'st_get_wallet_token_pnl',
  'st_get_wallet_trades',
  'st_rpc_get_account_info',
  'st_rpc_get_balance',
  'st_rpc_get_block',
  'st_rpc_get_block_height',
  'st_rpc_get_block_production',
  'st_rpc_get_blocks',
  'st_rpc_get_fee_for_message',
  'st_rpc_get_multiple_accounts',
  'st_rpc_get_program_accounts',
  'st_rpc_get_signature_statuses',
  'st_rpc_get_signatures_for_address',
  'st_rpc_get_token_account_balance',
  'st_rpc_get_token_accounts_by_delegate',
  'st_rpc_get_token_accounts_by_owner',
  'st_rpc_get_token_largest_accounts',
  'st_rpc_get_token_supply',
  'st_rpc_get_transaction',
  'st_rpc_get_transaction_count',
  'st_rpc_send_transaction',
  'st_rpc_simulate_transaction',
  'st_search_tokens',
] as const;

export const SOL_GPT_TRADING_ACTIONS = [
  'get_dflow_priority_fees',
  'get_quote',
  'list_dflow_tokens',
  'prepare_user_swap',
  'prepare_user_transfer',
] as const;

export const SOL_GPT_PREDICTION_ACTIONS = [
  'get_prediction_market',
  'get_prediction_orderbook',
  'search_prediction_markets',
] as const;

export const SOL_GPT_BROWSER_ACTIONS = [
  'browse_web',
  'browser_followup',
  'browser_session_status',
  'browser_session_stop',
] as const;

export const SOL_GPT_AGENTS_ACTIONS = [
  'get_asset',
  'search_solana_agents',
] as const;

export const ACTION_NAMES = [
  ...HELIUS_ACCOUNT_ACTIONS,
  ...HELIUS_WALLET_ACTIONS,
  ...HELIUS_ASSET_ACTIONS,
  ...HELIUS_TRANSACTION_ACTIONS,
  ...HELIUS_CHAIN_ACTIONS,
  ...HELIUS_STREAMING_ACTIONS,
  ...HELIUS_KNOWLEDGE_ACTIONS,
  ...HELIUS_WRITE_ACTIONS,
  ...HELIUS_COMPRESSION_ACTIONS,
  ...PHOENIX_ACTIONS,
  ...IMPERIAL_ACTIONS,
  ...SOL_GPT_MARKET_ACTIONS,
  ...SOL_GPT_OHLCV_ACTIONS,
  ...SOL_GPT_WALLET_ACTIONS,
  ...SOLANA_TRACKER_ACTIONS,
  ...SOL_GPT_TRADING_ACTIONS,
  ...SOL_GPT_PREDICTION_ACTIONS,
  ...SOL_GPT_BROWSER_ACTIONS,
  ...SOL_GPT_AGENTS_ACTIONS,
] as const;

export type ActionName = typeof ACTION_NAMES[number];

export const ACTION_NAME_SET = new Set<string>(ACTION_NAMES);
