/**
 * Commit attribution hook installer.
 *
 * Optional module behind the COMMIT_ATTRIBUTION feature flag. When the
 * optional `@clawd/commit-attribution` package is present this wires a
 * prepare-commit-msg hook; when absent it degrades to a no-op so the CLI
 * continues to work without the extra dependency.
 */
export declare function installPrepareCommitMsgHook(_worktreePath: string, _worktreeHooksDir?: string): Promise<void>;
//# sourceMappingURL=postCommitAttribution.d.ts.map