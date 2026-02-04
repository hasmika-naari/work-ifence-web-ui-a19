import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const baseURL = 'http://127.0.0.1:4200';
const skipWebServer = ['1', 'true', 'yes'].includes((process.env['E2E_SKIP_WEBSERVER'] ?? '').toLowerCase());

function portFromBaseURL(raw: string): number {
  try {
    const u = new URL(raw);
    const p = Number(u.port || '4200');
    return Number.isFinite(p) && p > 0 ? p : 4200;
  } catch {
    return 4200;
  }
}

export default defineConfig({
  testDir: './e2e',
  testMatch: [
    '**/*.e2e.spec.ts',
    '**/*.pw.spec.ts',
    '**/*.spec.e2e.ts'
  ],
  testIgnore: [
    '**/src/**/*.spec.ts',
    '**/src/**/*.test.ts',
    '**/node_modules/**',
    '**/dist/**'
  ],
  timeout: 60_000,
  expect: { timeout: 10000 },
  retries: process.env.CI ? 2 : 1,
  fullyParallel: !process.env['E2E_BASE_URL'],
  reporter: [['list']],

  use: {
    baseURL,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: path.resolve(__dirname, 'e2e/storageState.json'),
  },

  ...(skipWebServer
    ? {}
    : {
        webServer: {
          command: 'npm run start -- --port 4200 --host 127.0.0.1',
          url: 'http://127.0.0.1:4200',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),

  projects: [
    {
      name: 'setup',
      testMatch: /.*auth\.setup\.spec\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
