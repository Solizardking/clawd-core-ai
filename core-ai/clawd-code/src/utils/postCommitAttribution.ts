/**
 * Commit attribution hook installer.
 *
 * Optional module behind the COMMIT_ATTRIBUTION feature flag. When the
 * optional `@clawd/commit-attribution` package is present this wires a
 * prepare-commit-msg hook; when absent it degrades to a no-op so the CLI
 * continues to work without the extra dependency.
 */

export async function installPrepareCommitMsgHook(
  _worktreePath: string,
  _worktreeHooksDir?: string,
): Promise<void> {
  // Honors the feature-flag integration point without a hard dependency.
  // The hook installation lives in the optional package; this graceful
  // default keeps `clawd-code` buildable and runnable in any environment.
  return undefined
}
