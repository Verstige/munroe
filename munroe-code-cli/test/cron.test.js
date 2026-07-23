import test from 'node:test';
import assert from 'node:assert/strict';

import { parseCronTable, listCronJobs, pauseCronJob, resumeCronJob, deleteCronJob, cronStatus, runCronJob } from '../src/cron.js';

const SAMPLE = `
┌─────────────────────────────────────────────────────────────────────────┐
│                         Scheduled Jobs                                  │
└─────────────────────────────────────────────────────────────────────────┘

  5c5705e803d1 [active]
    Name:      Obsidian Session Sync + Memory Git Backup
    Schedule:  0 3 * * *
    Repeat:    31/999
    Next run:  2026-07-24T03:00:00-04:00
    Deliver:   origin
    Script:    obsidian-session-sync.py
    Mode:      no-agent (script stdout delivered directly)
    Last run:  2026-07-23T09:12:02.840118-04:00  ok

  791bad6ea0c9 [active]
    Name:      Daily Social Media Brief — 10:15am
    Schedule:  0 10 * * 2,3,4,5,6
    Repeat:    ∞
    Next run:  2026-07-24T10:00:00-04:00
    Script:    social-brief.py
    Mode:      agent
    Last run:  2026-07-23T10:15:00-04:00  failed
`;

test('parseCronTable extracts two jobs', () => {
  const jobs = parseCronTable(SAMPLE);
  assert.equal(jobs.length, 2);
  assert.equal(jobs[0].id, '5c5705e803d1');
  assert.equal(jobs[0].status, 'active');
  assert.equal(jobs[0].name, 'Obsidian Session Sync + Memory Git Backup');
  assert.equal(jobs[0].schedule, '0 3 * * * · 31/999');
  assert.equal(jobs[0].script, 'obsidian-session-sync.py');
  assert.equal(jobs[1].id, '791bad6ea0c9');
  assert.equal(jobs[1].name, 'Daily Social Media Brief — 10:15am');
  assert.equal(jobs[1].schedule, '0 10 * * 2,3,4,5,6 · ∞');
});

test('parseCronTable handles empty input', () => {
  assert.deepEqual(parseCronTable(''), []);
  assert.deepEqual(parseCronTable('nothing useful'), []);
});

test('cron wrappers exist and return false when runtime missing', async () => {
  // The runtime may or may not exist on this machine. The wrappers should
  // always return false (not throw) if no runtime is reachable.
  const runtime = await import('../src/runtime.js').then((m) => m.findRuntime().catch(() => null));
  if (runtime) {
    const status = await cronStatus();
    assert.equal(typeof status.running, 'boolean');
    const jobs = await listCronJobs();
    assert.ok(Array.isArray(jobs));
    assert.equal(await pauseCronJob('does-not-exist'), false);
    assert.equal(await resumeCronJob('does-not-exist'), false);
    assert.equal(await runCronJob('does-not-exist'), false);
    assert.equal(await deleteCronJob('does-not-exist'), false);
  } else {
    const jobs = await listCronJobs();
    assert.deepEqual(jobs, []);
    assert.equal(await pauseCronJob('x'), false);
    assert.equal(await deleteCronJob('x'), false);
  }
});