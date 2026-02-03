import { defineConfig, devices } from '@playwright/test';

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

const webServerPort = portFromBaseURL(baseURL);

export default defineConfig({
  testDir: __dirname,
  testMatch: /.*\.spec\.ts/,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 1,
  fullyParallel: !process.env['E2E_BASE_URL'],
  reporter: [['list']],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  ...(skipWebServer
    ? {}
    : {
        webServer: {
          command: 'npm run serve:dist:e2e',
          url: 'http://127.0.0.1:4200/',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
