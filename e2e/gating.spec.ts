import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { auth, entitled, flags, installE2E, mergeOverrides } from './auth-utils';

type Query = Record<string, string>;

const ENT_JOB_TRACKING = 'job.tracking';
const ENT_LEARN_PORTAL = 'learn.portal';
const ENT_JOB_ANALYTICS = 'job.analytics';

const NAV_TIMEOUT_MS = 20_000;

const benignConsoleErrorPatterns: RegExp[] = [
  /ResizeObserver loop limit exceeded/i,
  /ResizeObserver loop completed with undelivered notifications/i,
  /Failed to load resource:.*favicon/i,
  /favicon\.ico/i,
];

function parseUrl(raw: string) {
  const u = new URL(raw);
  const params: Query = {};
  for (const [k, v] of u.searchParams.entries()) params[k] = v;
  return { pathname: u.pathname, params };
}

async function expectQueryParams(pageUrl: string, expected: Query): Promise<void> {
  const u = parseUrl(pageUrl);
  expect(Object.keys(u.params).sort()).toEqual(Object.keys(expected).sort());
  for (const [k, v] of Object.entries(expected)) {
    expect(u.params[k]).toBe(v);
  }
}

async function waitForAngularStable(page: Page, timeoutMs = 10_000): Promise<void> {
  await page
    .waitForFunction(
      () => {
        const anyWin = window as any;
        const getAll = anyWin.getAllAngularTestabilities;
        if (typeof getAll !== 'function') return true;

        const testabilities = getAll();
        if (!Array.isArray(testabilities) || testabilities.length === 0) return true;

        return testabilities.every((t: any) => typeof t?.isStable === 'function' && t.isStable());
      },
      undefined,
      { timeout: timeoutMs }
    )
    .catch(() => {
      // ignore
    });
}

async function waitForAppReady(page: Page): Promise<void> {
  await page.waitForSelector('app-root', { state: 'attached', timeout: 20_000 });
  try {
    await page.waitForLoadState('networkidle', { timeout: 10_000 });
  } catch {
    // ignore (some pages keep connections open)
  }
  await waitForAngularStable(page, 10_000);
}

async function gotoAndWait(page: Page, targetPath: string): Promise<void> {
  await page.goto(targetPath, { waitUntil: 'domcontentloaded' });
  await waitForAppReady(page);
}

async function waitForPath(page: Page, expectedPath: string): Promise<void> {
  await page.waitForURL((url: URL) => url.pathname === expectedPath, { timeout: NAV_TIMEOUT_MS });
  await waitForAppReady(page);
}

async function waitForPathNot(page: Page, disallowedPath: string): Promise<void> {
  await page.waitForURL((url: URL) => url.pathname !== disallowedPath, { timeout: NAV_TIMEOUT_MS });
  await waitForAppReady(page);
}

test.describe('No URL bypass (gated routes)', () => {
  test.beforeEach(async ({ page }, testInfo: TestInfo) => {
    const stubs = {
      accessMe: {},
      entitlements: { plan: 'FREE', entitlements: {}, roles: [] },
    };
    (testInfo as any)._e2eStubs = stubs;

    await page.addInitScript(() => {
      try {
        (window as any).__E2E__ = undefined;
      } catch {
        // ignore
      }
    });

    // Keep runs backend-less and predictable.
    await page.route('**/api/access/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify((testInfo as any)._e2eStubs.accessMe ?? {}),
      });
    });

    await page.route('**/api/me/entitlements', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify((testInfo as any)._e2eStubs.entitlements ?? {}),
      });
    });

    // Fail tests on unexpected console/page errors (allowlist common benign noise).
    const errors: string[] = [];
    (testInfo as any)._consoleErrors = errors;

    const onConsole = (msg: any) => {
      if (msg.type() !== 'error') return;
      const text = String(msg.text() ?? '');
      if (!text || benignConsoleErrorPatterns.some((re) => re.test(text))) return;
      errors.push(`[console.error] ${text}`);
    };
    const onPageError = (err: any) => {
      const text = String(err?.stack ?? err?.message ?? err);
      if (!text || benignConsoleErrorPatterns.some((re) => re.test(text))) return;
      errors.push(`[pageerror] ${text}`);
    };

    page.on('console', onConsole);
    page.on('pageerror', onPageError);

    (testInfo as any)._detachConsoleGuards = () => {
      page.off('console', onConsole);
      page.off('pageerror', onPageError);
    };
  });

  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    const detach = (testInfo as any)._detachConsoleGuards as (() => void) | undefined;
    detach?.();

    const errors = (testInfo as any)._consoleErrors as string[] | undefined;
    if (!errors?.length) return;

    await testInfo.attach('console-errors.txt', {
      body: errors.join('\n\n---\n\n'),
      contentType: 'text/plain',
    });

    expect(errors, `Unexpected console/page errors:\n${errors.join('\n')}`).toEqual([]);
    void page;
  });

  for (const publicPath of ['/', '/pricing', '/resume-marketplace']) {
    test(`public route accessible without auth: ${publicPath}`, async ({ page }, testInfo) => {
      (testInfo as any)._e2eStubs.accessMe = {};

      await installE2E(page, auth({ authenticated: false, activated: false }));
      await gotoAndWait(page, publicPath);
      await waitForPath(page, publicPath);
      await expectQueryParams(page.url(), {});
    });
  }

  for (const gatedPath of ['/user/job-applications', '/user/resumes']) {
    test(`logged out cannot bypass gated route: ${gatedPath} redirects to /sign-in`, async ({ page }, testInfo) => {
      (testInfo as any)._e2eStubs.accessMe = {};

      await installE2E(page, auth({ authenticated: false, activated: false }));
      await gotoAndWait(page, gatedPath);
      await waitForPath(page, '/sign-in');
      await expectQueryParams(page.url(), {});
    });
  }

  test('logged in but missing entitlement: /course-central redirects to upgrade with params', async ({ page }, testInfo) => {
    (testInfo as any)._e2eStubs.accessMe = { userId: 'e2e', mode: 'PERSONAL' };

    await installE2E(
      page,
      mergeOverrides(
        auth({ authenticated: true, activated: true }),
        flags({ COURSE_CENTRAL: true }),
        entitled([])
      )
    );

    await gotoAndWait(page, '/course-central');
    await waitForPath(page, '/user/billing/upgrade');
    await expectQueryParams(page.url(), { feature: ENT_LEARN_PORTAL, returnUrl: '/course-central' });
  });

  test('logged in but missing entitlement: /user/job-analytics redirects to upgrade with params', async ({ page }, testInfo) => {
    (testInfo as any)._e2eStubs.accessMe = { userId: 'e2e', mode: 'PERSONAL' };

    await installE2E(
      page,
      mergeOverrides(
        auth({ authenticated: true, activated: true }),
        entitled([])
      )
    );

    await gotoAndWait(page, '/user/job-analytics');
    await waitForPath(page, '/user/billing/upgrade');
    await expectQueryParams(page.url(), { feature: ENT_JOB_ANALYTICS, returnUrl: '/user/job-analytics' });
  });

  test('logged in, flag enabled but entitlement missing: /user/job-applications redirects to upgrade with params', async ({ page }, testInfo) => {
    (testInfo as any)._e2eStubs.accessMe = { userId: 'e2e', mode: 'PERSONAL' };

    await installE2E(
      page,
      mergeOverrides(
        auth({ authenticated: true, activated: true }),
        flags({ JOB_TRACKING: true }),
        entitled([])
      )
    );

    await gotoAndWait(page, '/user/job-applications');
    await waitForPath(page, '/user/billing/upgrade');
    await expectQueryParams(page.url(), { feature: ENT_JOB_TRACKING, returnUrl: '/user/job-applications' });
  });

  test('logged in, entitled but flag disabled: /user/job-applications redirects away', async ({ page }, testInfo) => {
    (testInfo as any)._e2eStubs.accessMe = { userId: 'e2e', mode: 'PERSONAL' };

    await installE2E(
      page,
      mergeOverrides(
        auth({ authenticated: true, activated: true }),
        flags({ JOB_TRACKING: false }),
        entitled([ENT_JOB_TRACKING])
      )
    );

    await gotoAndWait(page, '/user/job-applications');
    await waitForPathNot(page, '/user/job-applications');
    expect(['/user/dashboard', '/']).toContain(parseUrl(page.url()).pathname);
  });

  test('logged in, entitled and flag enabled: /user/job-applications stays accessible', async ({ page }, testInfo) => {
    (testInfo as any)._e2eStubs.accessMe = { userId: 'e2e', mode: 'PERSONAL' };

    await installE2E(
      page,
      mergeOverrides(
        auth({ authenticated: true, activated: true }),
        flags({ JOB_TRACKING: true }),
        entitled([ENT_JOB_TRACKING])
      )
    );

    await gotoAndWait(page, '/user/job-applications');
    await waitForPath(page, '/user/job-applications');
  });
});
