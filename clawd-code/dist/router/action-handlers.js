import { z } from 'zod';
import { registerAuthTools } from '../tools/auth.js';
import { registerConfigTools } from '../tools/config.js';
import { registerPlanTools } from '../tools/plans.js';
import { registerBalanceTools } from '../tools/balance.js';
import { registerTransactionTools } from '../tools/transactions.js';
import { registerAssetTools } from '../tools/assets.js';
import { registerAccountTools } from '../tools/accounts.js';
import { registerFeeTools } from '../tools/fees.js';
import { registerNetworkTools } from '../tools/network.js';
import { registerBlockTools } from '../tools/blocks.js';
import { registerTokenTools } from '../tools/tokens.js';
import { registerDasExtraTools } from '../tools/das-extras.js';
import { registerWebhookTools } from '../tools/webhooks.js';
import { registerEnhancedWebSocketTools } from '../tools/enhanced-websockets.js';
import { registerLaserstreamTools } from '../tools/laserstream.js';
import { registerWalletTools } from '../tools/wallet.js';
import { registerDocsTools } from '../tools/docs.js';
import { registerGuideTools } from '../tools/guides.js';
import { registerRecommendTools } from '../tools/recommend.js';
import { registerSolanaKnowledgeTools } from '../tools/solana-knowledge.js';
import { registerTransferTools } from '../tools/transfers.js';
import { registerZkCompressionTools } from '../tools/zk-compression.js';
import { registerStakingTools } from '../tools/staking.js';
function isZodType(value) {
    return typeof value === 'object' && value !== null && typeof value.safeParse === 'function';
}
function buildRuntimeSchema(inputSchema) {
    if (isZodType(inputSchema) && 'passthrough' in inputSchema && typeof inputSchema.passthrough === 'function') {
        return inputSchema.passthrough();
    }
    if (!inputSchema || typeof inputSchema !== 'object' || Array.isArray(inputSchema)) {
        return null;
    }
    const rawShape = {};
    for (const [key, value] of Object.entries(inputSchema)) {
        if (isZodType(value)) {
            rawShape[key] = value;
        }
    }
    if (Object.keys(rawShape).length === 0) {
        return null;
    }
    return z.object(rawShape).passthrough();
}
function materializeActionParams(tool, params) {
    const schema = buildRuntimeSchema(tool.inputSchema);
    if (!schema) {
        return params;
    }
    const parsed = schema.safeParse(params);
    if (parsed.success) {
        return parsed.data;
    }
    const issue = parsed.error.issues[0];
    const path = issue?.path?.length ? issue.path.join('.') : 'input';
    const message = `Invalid parameters for ${tool.name}: ${path} ${issue?.message ?? 'is invalid'}`.trim();
    throw new Error(message);
}
class ActionHandlerCollector {
    tools = new Map();
    tool(name, ...rest) {
        let description;
        let inputSchema;
        if (typeof rest[0] === 'string') {
            description = rest.shift();
        }
        if (rest.length > 1 && typeof rest[0] === 'object' && rest[0] !== null) {
            inputSchema = rest.shift();
        }
        const handler = rest[0];
        if (typeof handler !== 'function') {
            throw new Error(`Action handler "${name}" is missing a callable handler`);
        }
        this.tools.set(name, {
            name: name,
            description,
            inputSchema,
            handler: handler,
        });
    }
}
let cachedActionHandlers = null;
export function registerActionHandlers(server) {
    registerAuthTools(server);
    registerConfigTools(server);
    registerPlanTools(server);
    registerBalanceTools(server);
    registerTransactionTools(server);
    registerAssetTools(server);
    registerAccountTools(server);
    registerFeeTools(server);
    registerNetworkTools(server);
    registerBlockTools(server);
    registerTokenTools(server);
    registerDasExtraTools(server);
    registerWebhookTools(server);
    registerEnhancedWebSocketTools(server);
    registerLaserstreamTools(server);
    registerWalletTools(server);
    registerDocsTools(server);
    registerGuideTools(server);
    registerRecommendTools(server);
    registerSolanaKnowledgeTools(server);
    registerTransferTools(server);
    registerZkCompressionTools(server);
    registerStakingTools(server);
}
export function getActionHandlers() {
    if (cachedActionHandlers) {
        return cachedActionHandlers;
    }
    const collector = new ActionHandlerCollector();
    registerActionHandlers(collector);
    cachedActionHandlers = collector.tools;
    return cachedActionHandlers;
}
export async function callActionHandler(action, params, extra) {
    const tool = getActionHandlers().get(action);
    if (!tool) {
        throw new Error(`No action handler registered for action "${action}"`);
    }
    const normalizedParams = materializeActionParams(tool, params);
    return await Promise.resolve(tool.handler(normalizedParams, extra));
}
