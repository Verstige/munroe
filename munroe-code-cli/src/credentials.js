import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { munroeHome, parseEnvFile } from './env.js';

export const LLM_PROVIDERS = [
  {
    id: 'minimax',
    label: 'Core',
    detail: 'Fast coding models',
    keys: ['MINIMAX_API_KEY'],
    primaryKey: 'MINIMAX_API_KEY',
    modelPolicy: 'minimax',
  },
  {
    id: 'kimi',
    label: 'Kimi',
    detail: 'Deep reasoning',
    keys: ['KIMI_API_KEY', 'KIMI_CODING_API_KEY'],
    primaryKey: 'KIMI_API_KEY',
    modelPolicy: 'kimi',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    detail: 'Bring any OpenRouter model',
    keys: ['OPENROUTER_API_KEY'],
    primaryKey: 'OPENROUTER_API_KEY',
    modelPolicy: 'openrouter',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    detail: 'GPT models via API key',
    keys: ['OPENAI_API_KEY'],
    primaryKey: 'OPENAI_API_KEY',
    modelPolicy: 'openai',
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    detail: 'Claude models via API key',
    keys: ['ANTHROPIC_API_KEY'],
    primaryKey: 'ANTHROPIC_API_KEY',
    modelPolicy: 'anthropic',
  },
  {
    id: 'google',
    label: 'Google',
    detail: 'Gemini models via API key',
    keys: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
    primaryKey: 'GOOGLE_API_KEY',
    modelPolicy: 'google',
  },
  {
    id: 'xai',
    label: 'xAI Grok',
    detail: 'Grok models via xAI API key',
    keys: ['XAI_API_KEY'],
    primaryKey: 'XAI_API_KEY',
    modelPolicy: 'xai',
  },
];

const ALL_KEYS = [...new Set(LLM_PROVIDERS.flatMap((p) => p.keys))];

export function maskSecret(value) {
  if (!value || typeof value !== 'string') return '';
  if (value.length <= 8) return '••••••••';
  return `${value.slice(0, 3)}••••${value.slice(-4)}`;
}

function globalEnvPath(env = process.env) {
  return path.join(munroeHome(env), '.env');
}

async function readEnvMap(file) {
  try {
    return parseEnvFile(await readFile(file, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}

function serializeEnvMap(map) {
  const lines = [
    '# Munroe Code credentials — do not commit this file',
    '# Managed by Munroe Code Settings → AI providers',
    '',
  ];
  for (const key of Object.keys(map).sort()) {
    const value = String(map[key] ?? '');
    // Quote if needed
    const needsQuote = /[\s#"']/.test(value);
    lines.push(`${key}=${needsQuote ? JSON.stringify(value) : value}`);
  }
  lines.push('');
  return lines.join('\n');
}

async function writeEnvMap(file, map) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporaryPath = `${file}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(temporaryPath, serializeEnvMap(map), { mode: 0o600 });
    await rename(temporaryPath, file);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

export async function listCredentialStatus(env = process.env) {
  const file = globalEnvPath(env);
  const fromFile = await readEnvMap(file);
  const providers = LLM_PROVIDERS.map((provider) => {
    const presentKeys = provider.keys.filter((key) => Boolean(fromFile[key] || env[key]));
    const source = provider.keys.some((key) => fromFile[key])
      ? 'munroe-env'
      : provider.keys.some((key) => env[key])
        ? 'shell'
        : 'none';
    const sampleKey = provider.primaryKey;
    const raw = fromFile[sampleKey] || env[sampleKey] || '';
    return {
      id: provider.id,
      label: provider.label,
      detail: provider.detail,
      modelPolicy: provider.modelPolicy,
      configured: presentKeys.length > 0,
      source,
      primaryKey: provider.primaryKey,
      masked: raw ? maskSecret(raw) : '',
      keys: provider.keys.map((key) => ({
        key,
        configured: Boolean(fromFile[key] || env[key]),
        source: fromFile[key] ? 'munroe-env' : env[key] ? 'shell' : 'none',
        masked: (fromFile[key] || env[key]) ? maskSecret(fromFile[key] || env[key]) : '',
      })),
    };
  });

  return {
    path: file,
    providers,
    configuredCount: providers.filter((p) => p.configured).length,
  };
}

export async function saveCredentials(updates = {}, env = process.env) {
  if (!updates || typeof updates !== 'object') throw new Error('Updates required');
  const file = globalEnvPath(env);
  const current = await readEnvMap(file);
  let changed = 0;

  for (const [key, value] of Object.entries(updates)) {
    if (!ALL_KEYS.includes(key)) {
      throw new Error(`Unsupported credential key: ${key}`);
    }
    if (value == null) continue;
    const text = String(value).trim();
    if (!text) {
      if (key in current) {
        delete current[key];
        changed += 1;
      }
      continue;
    }
    // Ignore masked placeholders so re-saving without edit doesn't wipe keys.
    if (text.includes('••••') || /^•+$/.test(text)) continue;
    if (current[key] === text) continue;
    current[key] = text;
    changed += 1;
  }

  if (changed > 0) await writeEnvMap(file, current);
  return listCredentialStatus(env);
}

export async function clearCredential(key, env = process.env) {
  if (!ALL_KEYS.includes(key)) throw new Error(`Unsupported credential key: ${key}`);
  const file = globalEnvPath(env);
  const current = await readEnvMap(file);
  if (key in current) {
    delete current[key];
    await writeEnvMap(file, current);
  }
  return listCredentialStatus(env);
}

export { ALL_KEYS as CREDENTIAL_KEYS };
