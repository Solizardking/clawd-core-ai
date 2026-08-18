import { getSpinnerPack, listSpinnerPackSlugs, type SpinnerPack } from './spinnerPacks.js';
export { getSpinnerPack, listSpinnerPackSlugs, type SpinnerPack };
/**
 * Applies a vendored spinner pack (see spinners/*.json) to the user's
 * settings, replacing the active spinner verbs. Local equivalent of the
 * install-spinner skill's GitHub-fetch flow, since the pack data now ships
 * with the CLI.
 */
export declare function applySpinnerPack(slug: string): {
    error: Error | null;
};
export declare function getSpinnerVerbs(): string[];
export declare const SPINNER_VERBS: string[];
//# sourceMappingURL=spinnerVerbs.d.ts.map