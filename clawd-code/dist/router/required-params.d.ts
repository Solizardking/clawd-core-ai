import type { ActionName } from './actions.js';
/**
 * Map of actions to their required top-level parameters.
 *
 * Only actions with unambiguous required fields are listed here.
 * Actions with "one-of" requirements (e.g. getAsset needs `id` OR `ids`)
 * or no required params are omitted — those rely on bespoke handler validation.
 */
export declare const ACTION_REQUIRED_PARAMS: Partial<Record<ActionName, string[]>>;
