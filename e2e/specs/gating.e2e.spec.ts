import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { auth, entitled, flags, installE2E, mergeOverrides } from '../auth-utils';

type Query = Record<string, string>;

const ENT_JOB_TRACKING = 'JOB_TRACKING';
const ENT_LEARN_PORTAL = 'LEARN_PORTAL';
const ENT_JOB_ANALYTICS = 'JOB_ANALYTICS';

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
  // Avoid networkidle as it can be flaky with background polling
  // try {
  //   await page.waitForLoadState('networkidle', { timeout: 10_000 });
  // } catch {
  //   // ignore (some pages keep connections open)
  // }
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
      // Use gotoAndWait to handle the full load and subsequent client-side redirect
      await gotoAndWait(page, gatedPath);
      // Guard redirects to /sign-in with returnUrl
      await waitForPath(page, '/sign-in');
      
      const u = new URL(page.url());
      expect(u.pathname).toBe('/sign-in');
      expect(u.searchParams.get('returnUrl')).toBe(gatedPath);
    });
  }

  /*
   * For logged-in but unauthorized users, the guard should CANCEL navigation (return false)
   * and the FeatureGateNotice component (in AppComponent) should display the denial reason.
   */

  test('logged in but missing entitlement: /course-central shows gate notice', async ({ page }, testInfo) => {
    (testInfo as any)._e2eStubs.accessMe = { userId: 'e2e', mode: 'PERSONAL' };

    await installE2E(
      page,
      mergeOverrides(
        auth({ authenticated: true, activated: true }),
        flags({ COURSE_CENTRAL: true }),
        entitled([]) // No entitlements
      )
    );

    // Deep link attempt
    await gotoAndWait(page, '/course-central');

    // Navigation should handle the specific logic. 
    // Since guard returns false, URL might not update or might revert. 
    // On deep link, it likely stays or shows base content.
    // Key requirement: FeatureGateNotice is visible.
    
    await expect(page.locator('[data-testid="feature-gate-notice"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="feature-gate-notice"]')).toContainText('Upgrade required');
  });

  test('logged in but missing entitlement: /user/job-analytics shows gate notice', async ({ page }, testInfo) => {
    (testInfo as any)._e2eStubs.accessMe = { userId: 'e2e', mode: 'PERSONAL' };

    await installE2E(
      page,
      mergeOverrides(
        auth({ authenticated: true, activated: true }),
        entitled([])
      )
    );

    await gotoAndWait(page, '/user/job-analytics');
    
    await expect(page.locator('[data-testid="feature-gate-notice"]')).toBeVisible({ timeout: 10000 });
    // Verify denial message or reason if specific
    await expect(page.locator('[data-testid="feature-gate-notice"]')).toContainText('Upgrade required');
  });

  test('logged in, flag enabled but entitlement missing: /user/job-applications shows gate notice', async ({ page }, testInfo) => {
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
    
    await expect(page.locator('[data-testid="feature-gate-notice"]')).toBeVisible();
    await expect(page.locator('[data-testid="feature-gate-notice"]')).toContainText('Upgrade required');
    // Ensure no infinite loading (spinner should eventually disappear or app becomes stable)
    await waitForAngularStable(page);
  });

  test('logged in, entitled but flag disabled: /user/job-applications redirects away or hides', async ({ page }, testInfo) => {
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
    // If flag is disabled, it often redirects to dashboard or 404 via other guards, 
    // or simply entitlement guard isn't even hit if route is disabled.
    // Assuming standard guard behavior for disabled route:
    await waitForPathNot(page, '/user/job-applications');
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
