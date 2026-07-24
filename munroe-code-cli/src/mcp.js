import { spawnSync } from 'node:child_process';

import { findRuntime } from './runtime.js';

async function runHermes(args, { timeout = 30000 } = {}) {
  const runtimePath = await findRuntime().catch(() => null);
  if (!runtimePath) {
    return { ok: false, stdout: '', stderr: 'runtime unavailable', code: -1 };
  }
  const result = spawnSync(runtimePath, args, {
    shell: false,
    encoding: 'utf8',
    timeout,
    env: process.env,
  });
  return {
    ok: result.status === 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    code: result.status ?? -1,
  };
}

function stripAnsi(text) {
  return String(text || '').replace(/\u001b\[[0-9;]*m/g, '');
}

export function parseMcpList(text) {
  const clean = stripAnsi(text);
  const servers = [];
  const lines = clean.split('\n');
  for (const line of lines) {
    // e.g. "  cua-driver       /Users/...   all          ✓ enabled"
    const match = line.match(/^\s*([a-zA-Z0-9._-]+)\s+(\S.*?)\s+(\S+)\s+([✓xX✗]|ok|enabled|disabled|error|failed|[^\s]+)\s*(.*)?$/i);
    if (!match) continue;
    const name = match[1];
    if (/^name$/i.test(name) || name.includes('─') || name.includes('-'.repeat(3))) continue;
    if (/^(MCP|Transport|Tools|Status)$/i.test(name)) continue;
    const transport = match[2].trim();
    const tools = match[3].trim();
    const statusRaw = `${match[4] || ''} ${match[5] || ''}`.trim().toLowerCase();
    let status = 'unknown';
    if (/enabled|✓|ok|connected|ready/.test(statusRaw)) status = 'enabled';
    else if (/disabled/.test(statusRaw)) status = 'disabled';
    else if (/fail|error|✗|x\b/.test(statusRaw)) status = 'error';
    else status = statusRaw || 'unknown';
    servers.push({
      name,
      transport,
      tools,
      status,
      enabled: status === 'enabled',
      source: 'configured',
    });
  }
  return servers;
}

export function parseMcpCatalog(text) {
  const clean = stripAnsi(text);
  const entries = [];
  const lines = clean.split('\n');
  for (const line of lines) {
    // "  linear             available                Find, create..."
    const match = line.match(/^\s*([a-zA-Z0-9._-]+)\s{2,}(.+?)\s{2,}(.+)$/);
    if (!match) continue;
    const name = match[1];
    if (/^name$/i.test(name) || name.includes('─') || name.includes('--')) continue;
    if (/^(Install|Commands|MCP)$/i.test(name)) continue;
    const status = match[2].trim();
    const description = match[3].trim();
    if (!description || description === 'Description') continue;
    entries.push({
      name,
      status,
      description,
      installed: /enabled|custom|installed/i.test(status),
      available: /available|enabled|custom/i.test(status),
      source: 'catalog',
    });
  }
  return entries;
}

export async function listMcpServers() {
  const result = await runHermes(['mcp', 'list']);
  const text = `${result.stdout}\n${result.stderr}`;
  return {
    ok: result.ok || /MCP Servers/i.test(text),
    servers: parseMcpList(text),
    raw: stripAnsi(text).trim(),
  };
}

export async function listMcpCatalog() {
  const result = await runHermes(['mcp', 'catalog']);
  const text = `${result.stdout}\n${result.stderr}`;
  return {
    ok: result.ok || /Catalog/i.test(text),
    entries: parseMcpCatalog(text),
    raw: stripAnsi(text).trim(),
  };
}

export async function addMcpServer(options = {}) {
  const name = String(options.name || '').trim();
  if (!name) return { ok: false, message: 'Name required' };
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) return { ok: false, message: 'Invalid server name' };

  const args = ['mcp', 'add', name];
  if (options.url) {
    args.push('--url', String(options.url));
    if (options.auth === 'oauth' || options.auth === 'header') args.push('--auth', options.auth);
  } else if (options.command) {
    args.push('--command', String(options.command));
    if (Array.isArray(options.args) && options.args.length) {
      args.push('--args', ...options.args.map(String));
    } else if (typeof options.args === 'string' && options.args.trim()) {
      args.push('--args', ...options.args.trim().split(/\s+/));
    }
  } else if (options.preset) {
    args.push('--preset', String(options.preset));
  } else {
    return { ok: false, message: 'Provide url, command, or preset' };
  }

  if (Array.isArray(options.env)) {
    for (const entry of options.env) {
      if (typeof entry === 'string' && entry.includes('=')) args.push('--env', entry);
    }
  }

  const result = await runHermes(args, { timeout: 60000 });
  const message = stripAnsi(`${result.stdout}\n${result.stderr}`).trim();
  const failed = !result.ok || /failed|error|invalid/i.test(message);
  return { ok: !failed, message: message || (failed ? 'Add failed' : 'Added') };
}

export async function installMcpCatalog(name) {
  const server = String(name || '').trim();
  if (!server) return { ok: false, message: 'Name required' };
  const result = await runHermes(['mcp', 'install', server], { timeout: 120000 });
  const message = stripAnsi(`${result.stdout}\n${result.stderr}`).trim();
  const failed = !result.ok || /failed|error|not found/i.test(message);
  return { ok: !failed, message: message || (failed ? 'Install failed' : 'Installed') };
}

export async function removeMcpServer(name) {
  const server = String(name || '').trim();
  if (!server) return { ok: false, message: 'Name required' };
  const result = await runHermes(['mcp', 'remove', server]);
  const message = stripAnsi(`${result.stdout}\n${result.stderr}`).trim();
  const failed = !result.ok || /failed|error|not found/i.test(message);
  return { ok: !failed, message: message || (failed ? 'Remove failed' : 'Removed') };
}

export async function testMcpServer(name) {
  const server = String(name || '').trim();
  if (!server) return { ok: false, message: 'Name required' };
  const result = await runHermes(['mcp', 'test', server], { timeout: 45000 });
  const message = stripAnsi(`${result.stdout}\n${result.stderr}`).trim();
  const ok = result.ok && !/failed|error|✗/i.test(message);
  return { ok, message: message || (ok ? 'Connection ok' : 'Connection failed') };
}
