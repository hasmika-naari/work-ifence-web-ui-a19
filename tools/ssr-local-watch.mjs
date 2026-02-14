import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const entry = path.join(projectRoot, 'dist', 'workifence', 'server', 'server.mjs');
const watchDir = path.dirname(entry);

let child = null;
let restartTimer = null;
let isRestarting = false;

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
  await waitForFile(entry);

  log(`Starting '${path.relative(projectRoot, entry)}'`);
  spawnChild();

  isRestarting = false;
}

function scheduleRestart() {
  if (restartTimer) clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    restartTimer = null;
    void restartNow();
  }, 250);
}

async function main() {
  log(`Watching '${path.relative(projectRoot, watchDir)}'`);
  await waitForFile(entry);
  await restartNow();

  // Watch SSR output directory for rebuilds.
  // On Windows, recursive watch is supported; if it errors, fall back to non-recursive.
  try {
    fs.watch(watchDir, { recursive: true }, () => scheduleRestart());
  } catch {
    fs.watch(watchDir, () => scheduleRestart());
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
