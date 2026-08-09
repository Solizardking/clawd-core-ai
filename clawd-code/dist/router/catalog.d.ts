import { type ActionName } from './actions.js';
import { type RoutedPublicToolName } from './action-groups.js';
import type { ActionCatalogEntry } from './types.js';
export declare const ACTION_CATALOG: Record<ActionName, ActionCatalogEntry>;
export declare function getActionCatalogEntry(action: ActionName): ActionCatalogEntry;
export declare function getActionsForTool(tool: RoutedPublicToolName): ActionName[];
