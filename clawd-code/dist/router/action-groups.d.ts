import { type ActionName } from './actions.js';
export declare const PUBLIC_TOOL_NAMES: readonly ["heliusAccount", "heliusWallet", "heliusAsset", "heliusTransaction", "heliusChain", "heliusStreaming", "heliusKnowledge", "heliusWrite", "heliusCompression", "expandResult"];
export type PublicToolName = typeof PUBLIC_TOOL_NAMES[number];
export type RoutedPublicToolName = Exclude<PublicToolName, 'expandResult'>;
export declare const ACTION_GROUPS: Record<RoutedPublicToolName, readonly ActionName[]>;
export declare function findPublicToolForAction(action: ActionName): RoutedPublicToolName;
