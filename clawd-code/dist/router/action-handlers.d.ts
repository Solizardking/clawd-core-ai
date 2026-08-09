import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ActionName } from './actions.js';
export type ActionHandlerResponse = {
    content?: Array<{
        type?: string;
        text?: string;
    }>;
    isError?: boolean;
    structuredContent?: unknown;
};
export type ActionHandler = (params: Record<string, unknown>, extra: unknown) => Promise<ActionHandlerResponse> | ActionHandlerResponse;
export type ActionHandlerDefinition = {
    name: ActionName;
    description?: string;
    inputSchema?: unknown;
    handler: ActionHandler;
};
export declare function registerActionHandlers(server: McpServer): void;
export declare function getActionHandlers(): Map<ActionName, ActionHandlerDefinition>;
export declare function callActionHandler(action: ActionName, params: Record<string, unknown>, extra: unknown): Promise<ActionHandlerResponse>;
