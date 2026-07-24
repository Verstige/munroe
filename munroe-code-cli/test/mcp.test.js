import test from 'node:test';
import assert from 'node:assert/strict';

import { parseMcpCatalog, parseMcpList } from '../src/mcp.js';

const LIST_SAMPLE = `
  MCP Servers:

  Name             Transport                      Tools        Status    
  ──────────────── ────────────────────────────── ──────────── ──────────
  cua-driver       /Users/julylan/.local/bin...   all          ✓ enabled
  linear           https://mcp.linear.app/sse     12           disabled
`;

const CATALOG_SAMPLE = `
  MCP Catalog + configured servers:

  Name               Status                   Description
  ------------------ ------------------------ -----------
  linear             available                Find, create, and update Linear issues, projects, and comments.
  n8n                available                Manage and inspect n8n workflows from Hermes (stdio bridge, no public port).
  cua-driver         custom — enabled         /Users/julylan/.local/bin/cua-driver
`;

test('parseMcpList extracts configured servers', () => {
  const servers = parseMcpList(LIST_SAMPLE);
  assert.ok(servers.length >= 1);
  const cua = servers.find((s) => s.name === 'cua-driver');
  assert.ok(cua);
  assert.equal(cua.enabled, true);
  assert.equal(cua.status, 'enabled');
});

test('parseMcpCatalog extracts catalog entries', () => {
  const entries = parseMcpCatalog(CATALOG_SAMPLE);
  assert.ok(entries.length >= 2);
  const linear = entries.find((e) => e.name === 'linear');
  assert.ok(linear);
  assert.match(linear.description, /Linear/i);
  assert.equal(linear.available, true);
});
