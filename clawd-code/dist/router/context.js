import { randomUUID } from 'node:crypto';
import { getNetwork } from '../utils/helius.js';
const SESSION_KEY = randomUUID();
export function getRouterContext() {
    const network = getNetwork();
    return {
        sessionKey: SESSION_KEY,
        network: network === 'devnet' ? 'devnet' : 'mainnet-beta',
    };
}
