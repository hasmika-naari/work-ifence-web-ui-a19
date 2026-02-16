import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const entry = path.join(projectRoot, 'dist', 'workifence', 'server', 'server.mjs');
const watchDir = path.dirname(entry);

const RESTART_DEBOUNCE_MS = 900;
const DIR_QUIET_PERIOD_MS = 700;

let child = null;
let restartTimer = null;
let isRestarting = false;

let lastFsEventAt = 0;

function log(msg) {
  // Match the existing console style from concurrently output.
  process.stdout.write(`[server] ${msg}\n`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForFile(filePath) {
  // Build watchers sometimes delete+rewrite the entry file; keep polling until it exists.
  // No hard timeout: in dev watch mode we want to recover whenever the build finishes.
  while (true) {
    if (fs.existsSync(filePath)) return;
    await sleep(150);
  }
}

function latestMjsMtimeMs(dirPath) {
  let latest = 0;
  const stack = [dirPath];

  while (stack.length) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!ent.isFile()) continue;
      if (!ent.name.endsWith('.mjs')) continue;
      try {
        const st = fs.statSync(full);
        const m = st.mtimeMs || 0;
        if (m > latest) latest = m;
      } catch {
        // ignore
      }
    }
  }

  return latest;
}

async function waitForStableOutputDir() {
  // Wait until the SSR output directory stops changing for a bit.
  // This prevents starting Node while chunks are still being rewritten,
  // which causes ERR_MODULE_NOT_FOUND for chunk imports.
  await waitForFile(entry);

  while (true) {
    const before = latestMjsMtimeMs(watchDir);
    const now = Date.now();

    // If fs.watch has seen recent events, give it time to quiet down.
    const msSinceEvent = now - lastFsEventAt;
    const extraWait = msSinceEvent < DIR_QUIET_PERIOD_MS ? (DIR_QUIET_PERIOD_MS - msSinceEvent) : 0;

    await sleep(DIR_QUIET_PERIOD_MS + extraWait);

    if (!fs.existsSync(entry)) {
      await waitForFile(entry);
      continue;
    }

    const after = latestMjsMtimeMs(watchDir);
    if (after !== 0 && after === before) return;
  }
}

function killChild() {
  if (!child) return;
  try {
    child.kill('SIGTERM');
  } catch {
    // ignore
  }
  child = null;
}

function spawnChild() {
  child = spawn(process.execPath, [entry], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    // If we're intentionally restarting, don't spam logs.
    if (isRestarting) return;
    log(`SSR process exited (code=${code}, signal=${signal ?? 'none'})`);

    // If the build temporarily removed the entry, keep trying.
    scheduleRestart();
  });
}

async function restartNow() {
  if (isRestarting) return;
  isRestarting = true;

  killChild();
  await waitForStableOutputDir();

  log(`Starting '${path.relative(projectRoot, entry)}'`);
  spawnChild();

  isRestarting = false;
}

function scheduleRestart() {
  if (restartTimer) clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    restartTimer = null;
    void restartNow();
  }, RESTART_DEBOUNCE_MS);
}

async function main() {
  log(`Watching '${path.relative(projectRoot, watchDir)}'`);
  await waitForStableOutputDir();
  await restartNow();

  // Watch SSR output directory for rebuilds.
  // On Windows, recursive watch is supported; if it errors, fall back to non-recursive.
  try {
    fs.watch(watchDir, { recursive: true }, () => {
      lastFsEventAt = Date.now();
      scheduleRestart();
    });
  } catch {
    fs.watch(watchDir, () => {
      lastFsEventAt = Date.now();
      scheduleRestart();
    });
  }

  // Graceful shutdown
  process.on('SIGINT', () => {
    killChild();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    killChild();
    process.exit(0);
  });
}

await main();
