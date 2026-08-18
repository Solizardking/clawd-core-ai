/**
 * Solana / data API provider credentials.
 *
 * Resolves the seven named env keys from an env bag (or process.env) and
 * reports configured vs missing status without leaking raw secrets in status
 * paths. Pure resolution only — no HTTP clients.
 */

import { maskSecret } from '../env.js';

/** Exact env var names this module resolves (order is stable for status output). */
export const PROVIDER_ENV_KEYS = [
  'JUPITER_API_KEY',
  'DFLOW_API_KEY',
  'HELIUS_API_KEY',
  'SOLANA_TRACKER_API_KEY',
  'BIRDEYE_API_KEY',
  'BLOCKSCOUT_API_KEY',
  'CDP_API_KEY_ID',
] as const;

export type ProviderEnvKey = (typeof PROVIDER_ENV_KEYS)[number];

export type EnvBag = Record<string, string | undefined>;

/** Resolved credential for one provider env key. */
export type ProviderCredential = {
  envKey: ProviderEnvKey;
  /** Raw value when present and non-empty; otherwise undefined. */
  value: string | undefined;
  /** True only when value is a non-empty string after trim. */
  configured: boolean;
};

/** Safe status for help/status paths — never includes the full secret. */
export type ProviderStatus = {
  envKey: ProviderEnvKey;
  configured: boolean;
  /** Masked value or "(unset)" — never the full secret. */
  masked: string;
};

function readEnvValue(envKey: ProviderEnvKey, env: EnvBag): string | undefined {
  const raw = env[envKey];
  if (raw === undefined || raw === null) return undefined;
  const trimmed = String(raw).trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Env bag used for resolution. Defaults to process.env so production code
 * can call with no args; tests inject synthetic maps.
 */
export function resolveEnvBag(env?: EnvBag): EnvBag {
  return env ?? (process.env as EnvBag);
}

/** Resolve a single provider credential from the given env bag. */
export function resolveProviderCredential(
  envKey: ProviderEnvKey,
  env?: EnvBag,
): ProviderCredential {
  const bag = resolveEnvBag(env);
  const value = readEnvValue(envKey, bag);
  return {
    envKey,
    value,
    configured: value !== undefined,
  };
}

/** Resolve all seven provider credentials. */
export function resolveProviderCredentials(env?: EnvBag): ProviderCredential[] {
  const bag = resolveEnvBag(env);
  return PROVIDER_ENV_KEYS.map((envKey) => resolveProviderCredential(envKey, bag));
}

/** Map of env key → raw value (only configured keys; missing keys omit or undefined). */
export function getProviderApiKeys(env?: EnvBag): Record<ProviderEnvKey, string | undefined> {
  const bag = resolveEnvBag(env);
  const out = {} as Record<ProviderEnvKey, string | undefined>;
  for (const envKey of PROVIDER_ENV_KEYS) {
    out[envKey] = readEnvValue(envKey, bag);
  }
  return out;
}

/** Raw API key for one provider, or undefined if unset/empty. */
export function getProviderApiKey(envKey: ProviderEnvKey, env?: EnvBag): string | undefined {
  return resolveProviderCredential(envKey, env).value;
}

/** Whether the named provider credential is present and non-empty. */
export function isProviderConfigured(envKey: ProviderEnvKey, env?: EnvBag): boolean {
  return resolveProviderCredential(envKey, env).configured;
}

/**
 * Status rows for CLI/help: configured boolean + masked value only.
 * Does not include raw secrets.
 */
export function getProviderStatus(env?: EnvBag): ProviderStatus[] {
  return resolveProviderCredentials(env).map((cred) => ({
    envKey: cred.envKey,
    configured: cred.configured,
    masked: maskSecret(cred.value),
  }));
}

/**
 * Compact configured-flags object (envKey → boolean). Stable for status
 * comparison; never includes secret values.
 */
export function getProviderConfiguredFlags(
  env?: EnvBag,
): Record<ProviderEnvKey, boolean> {
  const bag = resolveEnvBag(env);
  const flags = {} as Record<ProviderEnvKey, boolean>;
  for (const envKey of PROVIDER_ENV_KEYS) {
    flags[envKey] = isProviderConfigured(envKey, bag);
  }
  return flags;
}

/** Human-readable lines for inspect/help (no raw secrets). */
export function formatProviderStatusLines(env?: EnvBag): string[] {
  return getProviderStatus(env).map((row) => {
    const state = row.configured ? 'configured' : 'missing';
    return `${row.envKey}=${state} (${row.masked})`;
  });
}
