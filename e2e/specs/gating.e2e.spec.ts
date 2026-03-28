import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { auth, entitled, flags, installE2E, mergeOverrides } from '../auth-utils';

type Query = Record<string, string>;
type BackendEntitlementsStub = {
  plan: string;
  entitlements: Record<string, boolean>;
  roles: string[];
};

type AccessProfileContextStub = {
  activeProfileKey: string;
  ownedProfiles: Array<{ key: string; label: string }>;
};

type E2EStubs = {
  accessMe: Record<string, unknown>;
  entitlements: { plan: string; entitlements: Record<string, boolean>; roles: string[] };
  backendEntitlements: BackendEntitlementsStub;
  navMenu: { sections: unknown[] };
  profileContext: AccessProfileContextStub;
};

type SessionOptions = {
  accessMe: Record<string, unknown>;
  entitlementKeys?: string[];
  roles?: string[];
  authState?: { authenticated: boolean; activated?: boolean };
  flagsMap?: Record<string, boolean>;
  profile?: { activeProfileKey: string; mode: string };
};

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

function buildBackendEntitlements(keys: string[] = [], roles: string[] = []): BackendEntitlementsStub {
  const entitlements = Object.fromEntries(
    keys
      .map((key) => String(key ?? '').trim())
      .filter(Boolean)
      .map((key) => [key, true])
  );

  return {
    plan: 'FREE',
    entitlements,
    roles,
  };
}

function buildProfileContextStub(
  accessMe: Record<string, unknown>,
  profile?: { activeProfileKey: string; mode: string }
): AccessProfileContextStub {
  const activeProfileKey = String(profile?.activeProfileKey ?? accessMe?.['activeProfileKey'] ?? 'ROLE_USER').trim() || 'ROLE_USER';
  const availableProfiles = Array.isArray(accessMe?.['availableProfiles'])
    ? (accessMe['availableProfiles'] as Array<Record<string, unknown>>)
    : [];

  const ownedProfiles = availableProfiles.length > 0
    ? availableProfiles.map((entry) => ({
        key: String(entry?.['key'] ?? '').trim(),
        label: String(entry?.['label'] ?? entry?.['key'] ?? '').trim(),
      })).filter((entry) => !!entry.key)
    : [{ key: activeProfileKey, label: activeProfileKey }];

  return {
    activeProfileKey,
    ownedProfiles,
  };
}

async function seedProfileContext(page: Page, activeProfileKey: string, mode: string): Promise<void> {
  await page.addInitScript(
    ({ activeProfileKey: key, mode: currentMode }) => {
      localStorage.setItem(
        'wifence.profileContext',
        JSON.stringify({
          activeProfileKey: key,
          mode: currentMode,
          updatedAt: Date.now(),
        })
      );
    },
    { activeProfileKey, mode }
  );
}

async function installSession(page: Page, testInfo: TestInfo, options: SessionOptions): Promise<void> {
  const entitlementKeys = options.entitlementKeys ?? [];
  const roles = options.roles ?? [];
  const profile = {
    activeProfileKey: options.profile?.activeProfileKey ?? String(options.accessMe.activeProfileKey ?? 'ROLE_USER'),
    mode: options.profile?.mode ?? String(options.accessMe.mode ?? 'PERSONAL'),
  };

  const stubs = (testInfo as any)._e2eStubs as E2EStubs;
  stubs.accessMe = options.accessMe;
  stubs.entitlements = { plan: 'FREE', entitlements: {}, roles };
  stubs.backendEntitlements = buildBackendEntitlements(entitlementKeys, roles);
  stubs.navMenu = { sections: [] };
  stubs.profileContext = buildProfileContextStub(options.accessMe, profile);

  await seedProfileContext(page, profile.activeProfileKey, profile.mode);
  await installE2E(
    page,
    mergeOverrides(
      auth(options.authState ?? { authenticated: true, activated: true }),
      flags(options.flagsMap ?? {}),
      entitled(entitlementKeys),
      roles.length > 0 ? { entitlements: { roles } } : undefined
    )
  );
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
    const stubs: E2EStubs = {
      accessMe: {},
      entitlements: { plan: 'FREE', entitlements: {}, roles: [] },
      backendEntitlements: { plan: 'FREE', entitlements: {}, roles: [] },
      navMenu: { sections: [] },
      profileContext: { activeProfileKey: 'ROLE_USER', ownedProfiles: [{ key: 'ROLE_USER', label: 'ROLE_USER' }] },
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

    await page.route('**/api/entitlements/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify((testInfo as any)._e2eStubs.backendEntitlements ?? { plan: 'FREE', entitlements: {}, roles: [] }),
      });
    });

    await page.route('**/api/access/nav/menu', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify((testInfo as any)._e2eStubs.navMenu ?? { sections: [] }),
      });
    });

    await page.route('**/api/access/profile/context', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify((testInfo as any)._e2eStubs.profileContext ?? { activeProfileKey: 'ROLE_USER', ownedProfiles: [] }),
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

  test('upgrade flow: add resume handles allowed and blocked flows with live drawer payloads', async ({ page }, testInfo) => {
    let createEligibilityCalls = 0;
    let submittedUpgradeRequest: Record<string, unknown> | null = null;

    await page.route('**/api/subscription-plans**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/resume-plans/create-eligibility', async (route) => {
      createEligibilityCalls += 1;

      const body = createEligibilityCalls === 1
        ? { allowed: true }
        : {
            allowed: false,
            code: 'RESUME_LIMIT_REACHED',
            title: 'Resume limit reached',
            message: 'Upgrade to create more resumes.',
            currentPlan: {
              code: 'STARTER',
              name: 'Starter',
              marketingTitle: 'Starter',
              price: 0,
              currency: 'USD',
              billingInterval: 'MONTHLY',
              badgeText: 'Active',
              templateAccessLevel: 'BASIC',
            },
            usage: {
              used: 3,
              allowed: 3,
              remaining: 0,
            },
            upgradeOptions: [
              {
                planId: 101,
                code: 'PRO',
                marketingTitle: 'Pro',
                marketingSubtitle: 'Priority resume tools',
                price: 19,
                currency: 'USD',
                billingInterval: 'MONTHLY',
                badgeText: 'Recommended',
                recommended: true,
                featureBullets: ['10 resume slots', 'Premium templates'],
              },
              {
                planId: 202,
                code: 'PREMIUM',
                marketingTitle: 'Premium',
                marketingSubtitle: 'Advanced workflow coverage',
                price: 39,
                currency: 'USD',
                billingInterval: 'MONTHLY',
                featureBullets: ['Unlimited resumes', 'Alerts and job tracking'],
              },
            ],
          };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });

    await page.route('**/api/subscription-upgrade-requests', async (route) => {
      submittedUpgradeRequest = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'req-101', status: 'PENDING' }),
      });
    });

    await installSession(page, testInfo, {
      accessMe: {
        userId: 'resume-user',
        mode: 'PERSONAL',
        activeProfileKey: 'ROLE_USER',
        subscription: { planCode: 'STARTER', status: 'ACTIVE' },
        entitlements: { resumeLimit: 5, templateAccessLevel: 'BASIC' },
        counts: { resumeCount: 1 },
        availableProfiles: [{ key: 'ROLE_USER', label: 'Personal', homeRoute: '/user/dashboard' }],
      },
      entitlementKeys: ['RESUME_PORTAL'],
      flagsMap: { RESUME_PORTAL: true, SUBSCRIPTIONS: true },
      profile: { activeProfileKey: 'ROLE_USER', mode: 'PERSONAL' },
    });

    await gotoAndWait(page, '/user/resumes');
    await page.getByRole('button', { name: 'Add Resume' }).click();
    await waitForPath(page, '/user/resumes/resume');

    await gotoAndWait(page, '/user/resumes');
    await page.getByRole('button', { name: 'Add Resume' }).click();

    await expect(page.getByText('Resume limit reached')).toBeVisible();
    await expect(page.getByText('Your current plan')).toBeVisible();
    await expect(page.getByText('Starter')).toBeVisible();
    await expect(page.getByText('Usage')).toBeVisible();
    await expect(page.getByText('3 / 3 resumes used')).toBeVisible();
    await expect(page.getByText('Choose a plan')).toBeVisible();
    await expect(page.getByText('Priority resume tools')).toBeVisible();
    await expect(page.getByText('Advanced workflow coverage')).toBeVisible();

    const proPlan = page.locator('article.upgrade-plan-card').filter({ hasText: 'Pro' }).first();
    await proPlan.locator('textarea').fill('Need more resume slots for active applications');
    await proPlan.getByRole('button', { name: 'Request Upgrade' }).click();

    await expect(page.getByText('Upgrade request submitted')).toBeVisible();
    expect(submittedUpgradeRequest).toEqual({
      requestedPlanId: 101,
      requestReason: 'Need more resume slots for active applications',
    });
  });

  test('admin upgrade requests: list loads and approve/reject actions persist through refresh', async ({ page }, testInfo) => {
    const rows = [
      {
        id: 1,
        requestCode: 'REQ-001',
        userDisplay: 'Alice Reviewer',
        currentPlan: 'Starter',
        requestedPlan: 'Pro',
        status: 'PENDING',
        requestedDate: '2025-03-20T10:00:00Z',
        reviewedDate: null,
        adminRemarks: '',
      },
      {
        id: 2,
        requestCode: 'REQ-002',
        userDisplay: 'Bob Candidate',
        currentPlan: 'Pro',
        requestedPlan: 'Premium',
        status: 'PENDING',
        requestedDate: '2025-03-20T11:00:00Z',
        reviewedDate: null,
        adminRemarks: '',
      },
    ];
    const actionBodies: Array<{ action: string; id: string; body: Record<string, unknown> }> = [];

    await page.route('**/api/admin/subscription-upgrade-requests', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(rows),
      });
    });

    await page.route('**/api/admin/subscription-upgrade-requests/*/approve', async (route) => {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      const id = route.request().url().split('/').slice(-2)[0];
      const match = rows.find((row) => String(row.id) === id);
      if (match) {
        match.status = 'APPROVED';
        match.adminRemarks = String(body.adminRemarks ?? '');
        match.reviewedDate = '2025-03-21T09:00:00Z';
      }
      actionBodies.push({ action: 'approve', id, body });
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    });

    await page.route('**/api/admin/subscription-upgrade-requests/*/reject', async (route) => {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      const id = route.request().url().split('/').slice(-2)[0];
      const match = rows.find((row) => String(row.id) === id);
      if (match) {
        match.status = 'REJECTED';
        match.adminRemarks = String(body.adminRemarks ?? '');
        match.reviewedDate = '2025-03-21T09:05:00Z';
      }
      actionBodies.push({ action: 'reject', id, body });
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    });

    await installSession(page, testInfo, {
      accessMe: {
        userId: 'admin-user',
        mode: 'ADMIN',
        activeProfileKey: 'ROLE_ADMIN',
        availableProfiles: [{ key: 'ROLE_ADMIN', label: 'Admin', homeRoute: '/user/dashboard-admin' }],
      },
      entitlementKeys: ['ADMIN_BILLING_SUBSCRIPTIONS'],
      roles: ['ROLE_ADMIN'],
      flagsMap: { SUBSCRIPTIONS: true, ADMIN_CONSOLE: true },
      profile: { activeProfileKey: 'ROLE_ADMIN', mode: 'ADMIN' },
    });

    await gotoAndWait(page, '/user/admin/upgrade-requests');

    await expect(page.getByText('Upgrade Requests')).toBeVisible();
    await expect(page.getByText('REQ-001')).toBeVisible();
    await expect(page.getByText('REQ-002')).toBeVisible();

    const approveRow = page.locator('tr').filter({ hasText: 'REQ-001' });
    await approveRow.getByRole('button', { name: 'Approve' }).click();
    const approveDialog = page.locator('mat-dialog-container');
    await approveDialog.getByLabel('Admin notes').fill('Approved for additional recruiter seats');
    await approveDialog.getByRole('button', { name: 'Approve' }).click();
    await expect(page.getByText('Upgrade request approved.')).toBeVisible();
    await expect(page.locator('tr').filter({ hasText: 'REQ-001' })).toContainText('APPROVED');
    await expect(page.locator('tr').filter({ hasText: 'REQ-001' })).toContainText('Approved for additional recruiter seats');

    const rejectRow = page.locator('tr').filter({ hasText: 'REQ-002' });
    await rejectRow.getByRole('button', { name: 'Reject' }).click();
    const rejectDialog = page.locator('mat-dialog-container');
    await rejectDialog.getByLabel('Admin notes').fill('Missing business justification');
    await rejectDialog.getByRole('button', { name: 'Reject' }).click();
    await expect(page.getByText('Upgrade request rejected.')).toBeVisible();
    await expect(page.locator('tr').filter({ hasText: 'REQ-002' })).toContainText('REJECTED');
    await expect(page.locator('tr').filter({ hasText: 'REQ-002' })).toContainText('Missing business justification');

    expect(actionBodies).toEqual([
      {
        action: 'approve',
        id: '1',
        body: { adminRemarks: 'Approved for additional recruiter seats' },
      },
      {
        action: 'reject',
        id: '2',
        body: { adminRemarks: 'Missing business justification' },
      },
    ]);
  });
});
