import { spawn } from 'node:child_process';
import process from 'node:process';

const ROOT = new URL('..', import.meta.url);

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(`[e2e:ci] ${msg}`);
}

function warn(msg) {
  // eslint-disable-next-line no-console
  console.warn(`[e2e:ci] ${msg}`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const help = args.includes('--help') || args.includes('-h');
  const idx = args.indexOf('--');
  const playwrightArgs = idx >= 0 ? args.slice(idx + 1) : args;
  return { help, playwrightArgs };
}

function usage() {
  return [
    'Runs Playwright E2E in CI:',
    '  1) npm run build:dev',
    '  2) run Playwright tests (Playwright starts/stops the webServer)',
    '',
    'Usage:',
    '  npm run e2e:ci',
    '  npm run e2e:ci -- --project=chromium',
    '  npm run e2e:ci -- --list',
    '',
    'Env:',
    '  E2E_CI_PORT=4300   Force a specific port (optional)',
  ].join('\n');
}

async function waitForHttpOk(url, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) return true;
      lastError = new Error(`HTTP ${res.status} for ${url}`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

function spawnLogged(command, args, options = {}) {
  log(`$ ${command} ${args.join(' ')}`);
  return spawn(command, args, {
    cwd: new URL('.', ROOT),
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });
}

async function runCommand(command, args, options = {}) {
  const child = spawnLogged(command, args, options);
  const code = await new Promise((resolve) => child.on('exit', (c) => resolve(c ?? 1)));
  if (code !== 0) throw new Error(`${command} exited with code ${code}`);
}

async function main() {
  const { help, playwrightArgs } = parseArgs(process.argv);
  if (help) {
    // eslint-disable-next-line no-console
    console.log(usage());
    return;
  }

  const baseURL = 'http://127.0.0.1:4200';

  log(`Using base URL: ${baseURL}`);

  // Build once up-front (requirement).
  await runCommand('npm', ['run', 'build']);

  const server = spawnLogged('npm', ['run', 'serve:dist:e2e']);
  const stopServer = () => {
    if (!server.killed) {
      server.kill('SIGTERM');
    }
  };
  process.on('exit', stopServer);
  process.on('SIGINT', () => {
    stopServer();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    stopServer();
    process.exit(143);
  });

  await waitForHttpOk(`${baseURL}/pricing`, 120_000);

  const env = {
    ...process.env,
    E2E_SKIP_WEBSERVER: 'true',
  };

  const pw = spawnLogged('npx', ['playwright', 'test', '-c', 'e2e/playwright.config.ts', ...playwrightArgs], {
    env,
  });

  const pwCode = await new Promise((resolve) => pw.on('exit', (c) => resolve(c ?? 1)));
  stopServer();
  if (pwCode !== 0) {
    process.exitCode = pwCode;
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
