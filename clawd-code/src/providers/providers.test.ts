import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  PROVIDER_ENV_KEYS,
  resolveProviderCredentials,
  resolveProviderCredential,
  getProviderApiKeys,
  getProviderApiKey,
  isProviderConfigured,
  getProviderStatus,
  getProviderConfiguredFlags,
  formatProviderStatusLines,
  type ProviderEnvKey,
  type EnvBag,
} from './index.js';

const ALL_SEVEN: ProviderEnvKey[] = [
  'JUPITER_API_KEY',
  'DFLOW_API_KEY',
  'HELIUS_API_KEY',
  'SOLANA_TRACKER_API_KEY',
  'BIRDEYE_API_KEY',
  'BLOCKSCOUT_API_KEY',
  'CDP_API_KEY_ID',
];

function syntheticAllSet(): EnvBag {
  return {
    JUPITER_API_KEY: 'jup-secret-value-abc',
    DFLOW_API_KEY: 'dflow-secret-value-def',
    HELIUS_API_KEY: 'helius-secret-value-ghi',
    SOLANA_TRACKER_API_KEY: 'tracker-secret-value-jkl',
    BIRDEYE_API_KEY: 'birdeye-secret-value-mno',
    BLOCKSCOUT_API_KEY: 'blockscout-secret-value-pqr',
    CDP_API_KEY_ID: 'cdp-id-secret-value-stu',
  };
}

describe('PROVIDER_ENV_KEYS', () => {
  test('exports exactly the seven required env key names', () => {
    assert.deepEqual([...PROVIDER_ENV_KEYS], ALL_SEVEN);
    assert.equal(PROVIDER_ENV_KEYS.length, 7);
  });
});

describe('resolveProviderCredentials — all set', () => {
  test('marks every provider configured and returns non-empty values', () => {
    const env = syntheticAllSet();
    const creds = resolveProviderCredentials(env);
    assert.equal(creds.length, 7);
    for (const cred of creds) {
      assert.equal(cred.configured, true, `${cred.envKey} should be configured`);
      assert.ok(cred.value && cred.value.length > 0, `${cred.envKey} value present`);
      assert.equal(cred.value, env[cred.envKey]);
    }
    const names = creds.map((c) => c.envKey);
    assert.deepEqual(names, ALL_SEVEN);
  });
});

describe('resolveProviderCredentials — all unset', () => {
  test('marks every provider missing when env bag is empty', () => {
    const creds = resolveProviderCredentials({});
    assert.equal(creds.length, 7);
    for (const cred of creds) {
      assert.equal(cred.configured, false, `${cred.envKey} should be missing`);
      assert.equal(cred.value, undefined);
    }
  });

  test('treats whitespace-only values as unset', () => {
    const env: EnvBag = {
      JUPITER_API_KEY: '   ',
      HELIUS_API_KEY: '',
    };
    assert.equal(isProviderConfigured('JUPITER_API_KEY', env), false);
    assert.equal(isProviderConfigured('HELIUS_API_KEY', env), false);
    assert.equal(getProviderApiKey('JUPITER_API_KEY', env), undefined);
  });
});

describe('resolveProviderCredentials — partial set', () => {
  test('reports only the keys that are present as configured', () => {
    const env: EnvBag = {
      HELIUS_API_KEY: 'helius-only-key-12345',
      BIRDEYE_API_KEY: 'birdeye-only-key-67890',
    };
    const flags = getProviderConfiguredFlags(env);
    assert.equal(flags.HELIUS_API_KEY, true);
    assert.equal(flags.BIRDEYE_API_KEY, true);
    assert.equal(flags.JUPITER_API_KEY, false);
    assert.equal(flags.DFLOW_API_KEY, false);
    assert.equal(flags.SOLANA_TRACKER_API_KEY, false);
    assert.equal(flags.BLOCKSCOUT_API_KEY, false);
    assert.equal(flags.CDP_API_KEY_ID, false);

    assert.equal(getProviderApiKey('HELIUS_API_KEY', env), 'helius-only-key-12345');
    assert.equal(getProviderApiKey('JUPITER_API_KEY', env), undefined);
  });
});

describe('getProviderStatus — no secret leakage', () => {
  test('status never contains the full secret value', () => {
    const secret = 'super-secret-jupiter-key-xyz';
    const env: EnvBag = { JUPITER_API_KEY: secret };
    const status = getProviderStatus(env);
    const jup = status.find((s) => s.envKey === 'JUPITER_API_KEY');
    assert.ok(jup);
    assert.equal(jup!.configured, true);
    assert.ok(!jup!.masked.includes(secret), 'masked must not include full secret');
    assert.ok(jup!.masked.includes('...'), 'masked should use ellipsis');

    for (const row of status) {
      assert.ok(
        !Object.prototype.hasOwnProperty.call(row, 'value'),
        'status rows must not expose a value field',
      );
    }

    const lines = formatProviderStatusLines(env);
    const joined = lines.join('\n');
    assert.ok(!joined.includes(secret), 'format lines must not leak secret');
    assert.ok(joined.includes('JUPITER_API_KEY=configured'));
  });

  test('unset keys report missing and (unset) mask', () => {
    const status = getProviderStatus({});
    for (const row of status) {
      assert.equal(row.configured, false);
      assert.equal(row.masked, '(unset)');
    }
  });
});

describe('getProviderConfiguredFlags — consistency', () => {
  test('same env bag yields identical flags on repeated calls', () => {
    const env = syntheticAllSet();
    const a = getProviderConfiguredFlags(env);
    const b = getProviderConfiguredFlags(env);
    assert.deepEqual(a, b);
    for (const key of ALL_SEVEN) {
      assert.equal(a[key], true);
    }
  });

  test('partial env is stable across two status calls', () => {
    const env: EnvBag = {
      DFLOW_API_KEY: 'dflow-partial-key',
      CDP_API_KEY_ID: 'cdp-partial-id',
    };
    const first = getProviderStatus(env);
    const second = getProviderStatus(env);
    assert.deepEqual(
      first.map((r) => ({ envKey: r.envKey, configured: r.configured })),
      second.map((r) => ({ envKey: r.envKey, configured: r.configured })),
    );
    const flags = getProviderConfiguredFlags(env);
    assert.equal(flags.DFLOW_API_KEY, true);
    assert.equal(flags.CDP_API_KEY_ID, true);
    assert.equal(flags.HELIUS_API_KEY, false);
  });
});

describe('getProviderApiKeys', () => {
  test('returns a record keyed by all seven env names', () => {
    const env = syntheticAllSet();
    const keys = getProviderApiKeys(env);
    for (const name of ALL_SEVEN) {
      assert.ok(name in keys);
      assert.equal(keys[name], env[name]);
    }
  });
});

describe('resolveProviderCredential', () => {
  test('resolves a single key independently', () => {
    const env: EnvBag = { BLOCKSCOUT_API_KEY: 'bs-key-abc12345' };
    const cred = resolveProviderCredential('BLOCKSCOUT_API_KEY', env);
    assert.equal(cred.envKey, 'BLOCKSCOUT_API_KEY');
    assert.equal(cred.configured, true);
    assert.equal(cred.value, 'bs-key-abc12345');
  });
});
