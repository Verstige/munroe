import crypto from 'node:crypto';
import { access } from 'node:fs/promises';
import path from 'node:path';

import { projectSessionName, stateDir } from './config.js';

const TOOLSETS = 'terminal,file,code_execution,skills,memory,session_search,delegation,todo,clarify';

const PROVIDER_DEFAULT_MODELS = {
  minimax: 'minimax/minimax-m2',
  kimi: 'kimi/kimi-k2',
  openrouter: 'openrouter/auto',
  openai: 'openai/gpt-5',
  anthropic: 'anthropic/claude-sonnet-4',
  google: 'google/gemini-2.5-pro',
  xai: 'xai/grok-4',
};

export function resolveModelPolicy(policy, env = process.env) {
  const modelAccess = {
    minimax: Boolean(env.MINIMAX_API_KEY),
    kimi: Boolean(env.KIMI_API_KEY || env.KIMI_CODING_API_KEY),
    openrouter: Boolean(env.OPENROUTER_API_KEY),
    openai: Boolean(env.OPENAI_API_KEY),
    anthropic: Boolean(env.ANTHROPIC_API_KEY),
    google: Boolean(env.GOOGLE_API_KEY || env.GEMINI_API_KEY),
    xai: Boolean(env.XAI_API_KEY),
  };

  if (policy === 'kimi') {
    return { provider: 'kimi', model: PROVIDER_DEFAULT_MODELS.kimi, label: 'Munroe Kimi', accessConfigured: modelAccess.kimi };
  }
  if (policy === 'minimax') {
    return { provider: 'minimax', model: PROVIDER_DEFAULT_MODELS.minimax, label: 'Munroe Core', accessConfigured: modelAccess.minimax };
  }
  if (policy === 'openrouter') {
    return { provider: 'openrouter', model: PROVIDER_DEFAULT_MODELS.openrouter, label: 'OpenRouter', accessConfigured: modelAccess.openrouter };
  }
  if (policy === 'openai') {
    return { provider: 'openai', model: PROVIDER_DEFAULT_MODELS.openai, label: 'OpenAI', accessConfigured: modelAccess.openai };
  }
  if (policy === 'anthropic') {
    return { provider: 'anthropic', model: PROVIDER_DEFAULT_MODELS.anthropic, label: 'Anthropic', accessConfigured: modelAccess.anthropic };
  }
  if (policy === 'google') {
    return { provider: 'google', model: PROVIDER_DEFAULT_MODELS.google, label: 'Google', accessConfigured: modelAccess.google };
  }
  if (policy === 'xai') {
    return { provider: 'xai', model: PROVIDER_DEFAULT_MODELS.xai, label: 'xAI Grok', accessConfigured: modelAccess.xai };
  }

  if (policy === 'auto') {
    if (modelAccess.minimax) {
      return { provider: 'minimax', model: PROVIDER_DEFAULT_MODELS.minimax, label: 'Munroe Auto', accessConfigured: true };
    }
    if (modelAccess.kimi) {
      return { provider: 'kimi', model: PROVIDER_DEFAULT_MODELS.kimi, label: 'Munroe Auto', accessConfigured: true };
    }
    if (modelAccess.openrouter) {
      return { provider: 'openrouter', model: PROVIDER_DEFAULT_MODELS.openrouter, label: 'Munroe Auto', accessConfigured: true };
    }
    if (modelAccess.openai) {
      return { provider: 'openai', model: PROVIDER_DEFAULT_MODELS.openai, label: 'Munroe Auto', accessConfigured: true };
    }
    if (modelAccess.anthropic) {
      return { provider: 'anthropic', model: PROVIDER_DEFAULT_MODELS.anthropic, label: 'Munroe Auto', accessConfigured: true };
    }
    if (modelAccess.google) {
      return { provider: 'google', model: PROVIDER_DEFAULT_MODELS.google, label: 'Munroe Auto', accessConfigured: true };
    }
    if (modelAccess.xai) {
      return { provider: 'xai', model: PROVIDER_DEFAULT_MODELS.xai, label: 'Munroe Auto', accessConfigured: true };
    }
    return { provider: null, model: null, label: 'Munroe Auto', accessConfigured: false };
  }

  throw new Error(`Unsupported model policy: ${policy}`);
}

export function projectPrompt(cwd, userPrompt) {
  return [
    'You are Munroe Code, an agentic software workspace operating in the current project.',
    'Work through the task completely: inspect before changing, preserve project conventions, request approval for dangerous operations, run the real verification available in the repository, and report factual results.',
    'Never expose or discuss internal runtime or model-provider brands in the user-facing response. Refer to yourself and the product only as Munroe or Munroe Code.',
    `Project root: ${path.resolve(cwd)}`,
    `Task: ${userPrompt}`,
  ].join('\n\n');
}

export function buildRuntimeInvocation({
  runtimePath,
  cwd,
  config,
  env = process.env,
  prompt = null,
  interactive = true,
  resume = true,
}) {
  const model = resolveModelPolicy(config.model, env);
  const args = [];

  if (interactive) {
    args.push('--tui');
    if (resume) args.push('--continue', projectSessionName(cwd));
  } else {
    args.push('--oneshot', projectPrompt(cwd, prompt));
    args.push('--usage-file', path.join(stateDir(cwd), 'usage', `${Date.now()}-${crypto.randomUUID()}.json`));
  }

  if (model.provider) args.push('--provider', model.provider);
  if (model.model) args.push('--model', model.model);
  args.push('--toolsets', config.permissions === 'safe' ? 'file,skills,memory,session_search,todo,clarify' : TOOLSETS);
  args.push('--skills', 'numin-saas-rebuild');
  args.push('--pass-session-id');

  if (config.permissions === 'trusted') args.push('--yolo');

  return {
    command: runtimePath,
    args,
    cwd: path.resolve(cwd),
    env: {
      ...env,
      HERMES_SESSION_SOURCE: 'munroe-code',
      MUNROE_PRODUCT: 'Munroe Code',
    },
    shell: false,
    stdio: 'inherit',
  };
}

export async function findRuntime({ env = process.env, pathEntries = null } = {}) {
  if (env.MUNROE_RUNTIME_PATH) {
    await access(env.MUNROE_RUNTIME_PATH);
    return env.MUNROE_RUNTIME_PATH;
  }

  const entries = pathEntries ?? (env.PATH ?? '').split(path.delimiter);
  for (const entry of entries) {
    if (!entry) continue;
    const candidate = path.join(entry, 'hermes');
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue searching.
    }
  }
  throw new Error('Munroe runtime not found. Install the Munroe runtime before continuing.');
}
