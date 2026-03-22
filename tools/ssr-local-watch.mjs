import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRoot = process.cwd();
const entry = path.join(projectRoot, 'dist', 'workifence', 'server', 'server.mjs');
const watchDir = path.dirname(entry);

const RESTART_DEBOUNCE_MS = 1200;
const DIR_QUIET_PERIOD_MS = 1200;

let child = null;
let restartTimer = null;
let isRestarting = false;

let lastFsEventAt = 0;
let requiredFreshOutputAfterMs = Date.now();

function log(msg) {
  // Match the existing console style from concurrently output.
  process.stdout.write(`[server] ${msg}\n`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function probeEntryImport(entryFile) {
  return new Promise((resolve) => {
    const fileUrl = pathToFileURL(entryFile).href;
    const probe = spawn(
      process.execPath,
      ['--input-type=module', '--eval', `await import(${JSON.stringify(fileUrl)});`],
      {
        stdio: ['ignore', 'pipe', 'pipe'],
        env: process.env,
      }
    );

    let stderr = '';
    probe.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    probe.on('exit', (code) => {
      resolve({
        ok: code === 0,
        stderr: stderr.trim(),
      });
    });

    probe.on('error', (error) => {
      resolve({
        ok: false,
        stderr: String(error),
      });
    });
  });
}

async function waitForFile(filePath) {
  // Build watchers sometimes delete+rewrite the entry file; keep polling until it exists.
  // No hard timeout: in dev watch mode we want to recover whenever the build finishes.
  while (true) {
    if (fs.existsSync(filePath)) return;
    await sleep(150);
  }
}

function getTopLevelRelativeImportSpecifiers(sourceText) {
  const specs = [];
  const lines = sourceText.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isImportLine = trimmed.startsWith('import ');
    const isExportFromLine = trimmed.startsWith('export ') && trimmed.includes(' from ');

    // In generated server bundles, all static imports are at the top.
    if (!isImportLine && !isExportFromLine) {
      break;
    }

    const m = trimmed.match(/['"]([^'"]+)['"]/);
    if (!m) continue;

    const spec = m[1];
    if (spec.startsWith('./') || spec.startsWith('../')) {
      specs.push(spec);
    }
  }

  return specs;
}

function resolveImportTarget(baseFile, spec) {
  // Build output uses explicit .mjs imports; still support extension-less fallbacks for robustness.
  const direct = path.resolve(path.dirname(baseFile), spec);
  const candidates = [
    direct,
    `${direct}.mjs`,
    `${direct}.js`,
    path.join(direct, 'index.mjs'),
    path.join(direct, 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function findMissingEntryImports(entryFile) {
  return inspectStaticImportGraph(entryFile).missing;
}

function getEntryImportSnapshot(entryFile) {
  const graph = inspectStaticImportGraph(entryFile);
  if (graph.missing.length > 0) {
    return null;
  }

  const files = [...graph.files];

  const snapshot = [];
  for (const file of files) {
    try {
      const stat = fs.statSync(file);
      snapshot.push(`${path.basename(file)}:${Math.floor(stat.mtimeMs || 0)}:${stat.size}`);
    } catch {
      return null;
    }
  }

  snapshot.sort();
  return snapshot.join('|');
}

function inspectStaticImportGraph(entryFile) {
  const queue = [entryFile];
  const seen = new Set();
  const files = [];
  const missing = [];

  while (queue.length) {
    const currentFile = queue.pop();
    if (!currentFile || seen.has(currentFile)) {
      continue;
    }

    seen.add(currentFile);

    let source;
    try {
      source = fs.readFileSync(currentFile, 'utf8');
    } catch {
      missing.push(currentFile);
      continue;
    }

    files.push(currentFile);

    const specs = getTopLevelRelativeImportSpecifiers(source);
    for (const spec of specs) {
      const resolved = resolveImportTarget(currentFile, spec);
      if (!resolved) {
        missing.push(path.resolve(path.dirname(currentFile), spec));
        continue;
      }
      if (!seen.has(resolved)) {
        queue.push(resolved);
      }
    }
  }

  return {
    files,
    missing: [...new Set(missing)].sort(),
  };
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

function getFileMtimeMs(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs || 0;
  } catch {
    return 0;
  }
}

async function waitForStableOutputDir() {
  // Wait until the SSR output directory stops changing for a bit.
  // This prevents starting Node while chunks are still being rewritten,
  // which causes ERR_MODULE_NOT_FOUND for chunk imports.
  await waitForFile(entry);

  let stablePasses = 0;
  let lastVerifiedSnapshot = '';

  while (true) {
    const before = latestMjsMtimeMs(watchDir);
    const now = Date.now();

    // If fs.watch has seen recent events, give it time to quiet down.
    const msSinceEvent = now - lastFsEventAt;
    const extraWait = msSinceEvent < DIR_QUIET_PERIOD_MS ? (DIR_QUIET_PERIOD_MS - msSinceEvent) : 0;

    await sleep(DIR_QUIET_PERIOD_MS + extraWait);

    if (!fs.existsSync(entry)) {
      stablePasses = 0;
      lastVerifiedSnapshot = '';
      await waitForFile(entry);
      continue;
    }

    const after = latestMjsMtimeMs(watchDir);
    if (after !== 0 && after === before) {
      const entryMtime = getFileMtimeMs(entry);
      const newestOutputMtime = Math.max(after, entryMtime);
      if (newestOutputMtime <= requiredFreshOutputAfterMs) {
        stablePasses = 0;
        lastVerifiedSnapshot = '';
        continue;
      }

      const missingImports = findMissingEntryImports(entry);
      if (missingImports.length === 0) {
        const snapshot = getEntryImportSnapshot(entry);
        if (!snapshot) {
          stablePasses = 0;
          lastVerifiedSnapshot = '';
          continue;
        }

        if (snapshot === lastVerifiedSnapshot) {
          stablePasses += 1;
        } else {
          stablePasses = 1;
          lastVerifiedSnapshot = snapshot;
        }

        if (stablePasses >= 2) {
          const probe = await probeEntryImport(entry);
          if (probe.ok) {
            return;
          }

          stablePasses = 0;
          lastVerifiedSnapshot = '';

          if (probe.stderr.includes('ERR_MODULE_NOT_FOUND')) {
            log('SSR bundle not ready yet; waiting for chunk graph to settle.');
          }
        }
        continue;
      }
    }

    stablePasses = 0;
    lastVerifiedSnapshot = '';
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
  requiredFreshOutputAfterMs = Date.now();
  if (restartTimer) clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    restartTimer = null;
    void restartNow();
  }, RESTART_DEBOUNCE_MS);
}

async function main() {
  log(`Watching '${path.relative(projectRoot, watchDir)}'`);
  requiredFreshOutputAfterMs = Date.now();
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
