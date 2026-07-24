import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export function parseEnvFile(contents) {
  const result = {};
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

export function isPlaceholderSecret(value) {
  if (value == null) return true;
  const text = String(value).trim();
  if (!text) return true;
  return /^(stub|test|xxx+|todo|changeme|your[_-]?.*|replace[_-]?me|dummy|null|undefined)$/i.test(text);
}

export async function readEnvFile(file) {
  try {
    return parseEnvFile(await readFile(file, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}

export function munroeHome(env = process.env) {
  const home = env.MUNROE_HOME;
  const fallback = path.join(os.homedir() || '/tmp', '.munroe');
  if (!home) return fallback;
  if (home === '.munroe' || home === '~/.munroe') return fallback;
  const resolved = path.resolve(home);
  // Refuse obviously unsafe targets; fall back to user home.
  if (resolved === '/' || resolved === path.sep) return fallback;
  return resolved;
}

export async function loadEnvLayers(cwd, env = process.env) {
  const layers = [await readEnvFile(path.join(munroeHome(env), '.env'))];
  if (cwd) layers.push(await readEnvFile(path.join(cwd, '.munroe', '.env')));
  const merged = Object.assign({}, ...layers);
  for (const [key, value] of Object.entries(merged)) {
    if (isPlaceholderSecret(value)) delete merged[key];
  }
  return merged;
}

/** Provider credentials: Hermes home env (base) + Munroe env layers (override). */
export async function loadProviderEnv(cwd, env = process.env) {
  const home = env.HOME || os.homedir() || '';
  const hermesEnv = await readEnvFile(path.join(home, '.hermes', '.env'));
  for (const [key, value] of Object.entries(hermesEnv)) {
    if (isPlaceholderSecret(value)) delete hermesEnv[key];
  }
  const munroeEnv = await loadEnvLayers(cwd, env);
  // Munroe/project keys win over Hermes home keys; process.env handled in envWithKeys.
  return { ...hermesEnv, ...munroeEnv };
}

export function envWithKeys(base, keys) {
  const next = { ...base };
  for (const key of keys) {
    if (key in next && !isPlaceholderSecret(next[key])) continue;
    if (process.env[key] && !isPlaceholderSecret(process.env[key])) next[key] = process.env[key];
    else if (isPlaceholderSecret(next[key])) delete next[key];
  }
  return next;
}
