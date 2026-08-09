import type { RoutedPublicToolName } from './action-groups.js';
import { type RouterResponse } from './responses.js';
export declare function dispatchRoutedTool(publicTool: RoutedPublicToolName, params: Record<string, unknown>, extra: unknown): Promise<RouterResponse>;
export declare function expandStoredResult(params: Record<string, unknown>, extra: unknown): Promise<RouterResponse>;
