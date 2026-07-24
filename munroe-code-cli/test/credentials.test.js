import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { clearCredential, listCredentialStatus, maskSecret, saveCredentials } from '../src/credentials.js';

async function tempHome() {
  return mkdtemp(path.join(os.tmpdir(), 'munroe-cred-home-'));
}

test('maskSecret hides middle of keys', () => {
  assert.match(maskSecret('sk-abcdefg123456'), /^sk-•+3456$/);
  assert.equal(maskSecret('short'), '••••••••');
  assert.equal(maskSecret(''), '');
});

test('saveCredentials writes keys to munroe home env and never returns raw secrets', async () => {
  const home = await tempHome();
  const env = { MUNROE_HOME: home };
  const status = await saveCredentials({ OPENAI_API_KEY: 'sk-test-secret-key-9999' }, env);
  const openai = status.providers.find((p) => p.id === 'openai');
  assert.equal(openai.configured, true);
  assert.equal(openai.source, 'munroe-env');
  assert.match(openai.masked, /•/);
  assert.doesNotMatch(openai.masked, /secret/);

  const file = path.join(home, '.env');
  const text = await readFile(file, 'utf8');
  assert.match(text, /OPENAI_API_KEY=sk-test-secret-key-9999/);

  // Re-saving a masked placeholder must not wipe the key.
  await saveCredentials({ OPENAI_API_KEY: openai.masked }, env);
  const again = await listCredentialStatus(env);
  assert.equal(again.providers.find((p) => p.id === 'openai').configured, true);

  await clearCredential('OPENAI_API_KEY', env);
  const cleared = await listCredentialStatus(env);
  assert.equal(cleared.providers.find((p) => p.id === 'openai').configured, false);
});

test('saveCredentials rejects unknown keys', async () => {
  const home = await tempHome();
  await assert.rejects(
    () => saveCredentials({ NOT_A_REAL_KEY: 'x' }, { MUNROE_HOME: home }),
    /Unsupported credential key/,
  );
});
