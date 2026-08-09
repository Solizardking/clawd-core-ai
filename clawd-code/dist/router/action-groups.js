import { HELIUS_ACCOUNT_ACTIONS, HELIUS_ASSET_ACTIONS, HELIUS_CHAIN_ACTIONS, HELIUS_COMPRESSION_ACTIONS, HELIUS_KNOWLEDGE_ACTIONS, HELIUS_STREAMING_ACTIONS, HELIUS_TRANSACTION_ACTIONS, HELIUS_WALLET_ACTIONS, HELIUS_WRITE_ACTIONS, } from './actions.js';
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
    'expandResult',
];
export const ACTION_GROUPS = {
    heliusAccount: HELIUS_ACCOUNT_ACTIONS,
    heliusWallet: HELIUS_WALLET_ACTIONS,
    heliusAsset: HELIUS_ASSET_ACTIONS,
    heliusTransaction: HELIUS_TRANSACTION_ACTIONS,
    heliusChain: HELIUS_CHAIN_ACTIONS,
    heliusStreaming: HELIUS_STREAMING_ACTIONS,
    heliusKnowledge: HELIUS_KNOWLEDGE_ACTIONS,
    heliusWrite: HELIUS_WRITE_ACTIONS,
    heliusCompression: HELIUS_COMPRESSION_ACTIONS,
};
export function findPublicToolForAction(action) {
    for (const [tool, actions] of Object.entries(ACTION_GROUPS)) {
        if (actions.includes(action)) {
            return tool;
        }
    }
    throw new Error(`No public tool mapping found for action "${action}"`);
}
