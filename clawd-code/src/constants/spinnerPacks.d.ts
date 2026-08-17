export interface SpinnerPack {
    slug: string;
    label: string;
    verbs: string[];
}
export declare const SPINNER_PACKS: SpinnerPack[];
export declare function getSpinnerPack(slug: string): SpinnerPack | undefined;
export declare function listSpinnerPackSlugs(): string[];
//# sourceMappingURL=spinnerPacks.d.ts.map