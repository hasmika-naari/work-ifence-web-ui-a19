import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { waitForLoginSuccess } from '../helpers/auth';

const storageStatePath = path.resolve(__dirname, '../storageState.json');

// Load credentials from env or fallback for local dev
const isCI = !!process.env.CI;
const username = process.env.E2E_USERNAME || (!isCI ? 'testuser@example.com' : '');
const password = process.env.E2E_PASSWORD || (!isCI ? 'testpassword' : '');

if (!username || !password) {
  throw new Error('Missing E2E_USERNAME/E2E_PASSWORD environment variables.');
}

// Enforce validation to match app rules (email format + minLength 8)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = emailRegex.test(username);
const isValidPassword = password.length >= 8;

if (!isValidEmail || !isValidPassword) {
  console.error(`Username: ${username} (valid: ${isValidEmail})`);
  console.error(`Password length: ${password.length} (valid: ${isValidPassword})`);
  throw new Error("Invalid E2E creds: email must be valid and password >= 8 chars");
}

const TEST_USER = { username, password };

const mockUserName = TEST_USER.username.includes('@')
  ? TEST_USER.username.split('@')[0]
  : TEST_USER.username;

test('login and save storageState', async ({ page }) => {
  test.setTimeout(120000); // Allow 2 minutes for slow CI/Build
  console.log(`Starting auth setup for user: ${TEST_USER.username}`);
  
  try {
    // Enable E2E-only markers before the app boots.
    await page.addInitScript(() => {
      (window as any).__E2E__ = true;
    });

    // Mirror browser-side logs/errors into the Playwright runner output.
    page.on('console', (msg) => {
      // Skip extremely noisy messages if needed; keep everything for now.
      console.log(`[browser:${msg.type()}] ${msg.text()}`);
    });
    page.on('pageerror', (err) => {
      console.error('[pageerror]', err);
    });

    // Mock API responses for successful login (install BEFORE any navigation)
    await page.route('**/api/wif-login', async route => {
      await route.fulfill({
        status: 200,
        json: {
          userName: mockUserName,
          emailId: TEST_USER.username,
          id_token: null,
          status: 'activated',
        },
      });
    });

    // SignInComponent (E2E mode) calls /api/mock/login
    await page.route('**/api/mock/login', async route => {
      await route.fulfill({
        status: 200,
        json: {
          emailId: TEST_USER.username,
          id_token: 'mock-jwt-token',
          status: 'activated',
          userName: mockUserName,
          username: TEST_USER.username,
        },
      });
    });

    await page.route('**/api/authenticate', async route => {
      await route.fulfill({
        status: 200,
        json: {
          // Keep as an obvious fake token; app treats it as opaque.
          id_token: 'mock-jwt-token',
        },
      });
    });

    await page.route('**/api/account', async route => {
      await route.fulfill({ 
        status: 200, 
        json: { 
          id: 1050,
          login: mockUserName,
          firstName: 'janardhana rao',
          lastName: 'kesineni',
          email: TEST_USER.username,
          imageUrl: null,
          activated: true,
          langKey: 'en',
          createdBy: 'anonymousUser',
          createdDate: '2026-02-01T05:09:47Z',
          lastModifiedBy: 'anonymousUser',
          lastModifiedDate: '2026-02-01T05:10:24Z',
          authorities: ['ROLE_USER'],
        } 
      });
    });

    await page.route('**/api/login-profile-by-name*', async route => {
      await route.fulfill({ 
        status: 200, 
        json: {
          id: 1500,
          userName: mockUserName,
          userId: '1050',
          memberId: 'dg2h3g7d',
          phoneNumber: null,
          emailId: TEST_USER.username,
          password: '$2a$10$heW27db3Lth.6l58PTAreeJ1YWEWZte8S2.XHSCdrBb2zuwRoAu1q',
          status: 'activated',
          activationCode: 'YsRCA20aY4JiidAzgvUp',
        },
      });
    });

    await page.route('**/api/bio-profile-by-name*', async route => {
      await route.fulfill({ 
        status: 200, 
        json: {
          id: 1500,
          userName: mockUserName,
          userId: '1050',
          memberId: null,
          firstName: 'janardhana rao',
          lastName: 'kesineni',
          dob: null,
          gender: null,
          imageUrl: 'https://workifence.s3.amazonaws.com/common/noavatar.png',
          title: null,
          summary: null,
        },
      });
    });

    // Ensure AccessFacadeService.isLoggedIn() becomes true after login.
    await page.route('**/api/access/me', async route => {
      await route.fulfill({
        status: 200,
        json: {
          mode: 'PERSONAL',
          userId: 1050,
          userName: mockUserName,
          enterpriseId: null,
          enterpriseRole: null,
          subscription: {
            planCode: 'FREE_INDIVIDUAL',
            status: 'ACTIVE',
            trialEndDate: null,
            currentPeriodEnd: null,
          },
          entitlements: {
            resumeLimit: 1,
            templateAccessLevel: 'BASIC',
            jobTrackingEnabled: true,
            courseCentralEnabled: true,
            alertsEnabled: false,
            enterpriseUsersLimit: null,
            storageLimitMb: 200,
            features: {},
          },
          counts: {
            resumeCount: 0,
            jobApplicationCount: null,
          },
        },
      });
    });

    // Ensure entitlementRouteGuard can pass for dashboard navigation.
    await page.route('**/api/me/entitlements', async route => {
      await route.fulfill({
        status: 200,
        json: {
          plan: 'FREE',
          roles: ['ROLE_USER'],
          entitlements: { 'user.dashboard': true },
        },
      });
    });

    // 1. Navigate to Landing Page
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    console.log('Navigated to landing page.');

    // 2. Wait for either TestID or Text Fallback for Sign In
    // Remove navbar wait as layout might differ
    const signInButton = page.getByTestId('header-sign-in').or(page.getByRole('link', { name: /Sign In/i })).first();
    await expect(signInButton).toBeVisible({ timeout: 30000 });
    console.log('Sign In button found.');

    // 3. Click Sign In
    console.log('Clicking header Sign In...');
    await signInButton.click();

    // 4. Wait for URL to update
    await expect(page).toHaveURL(/.*\/sign-in/, { timeout: 30000 });
    console.log('URL updated to sign-in.');

    // 5. Wait for Login Form
    try {
      await expect(page.getByTestId('login-form')).toBeVisible({ timeout: 30000 });
      console.log('Login form found.');
    } catch (e) {
      console.error('Login form wait failed.');
      throw e;
    }

    // Fill and submit the SignInComponent form (email/password)
    const emailInput = page.getByTestId('login-email');
    const passwordInput = page.getByTestId('login-password');
    const submitButton = page.getByTestId('login-submit');

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(emailInput).toBeEditable({ timeout: 10000 });
    await emailInput.fill(TEST_USER.username);
    await page.keyboard.press('Tab');

    await expect(passwordInput).toBeEditable({ timeout: 10000 });
    await passwordInput.fill(TEST_USER.password);
    await page.keyboard.press('Tab');

    await expect(submitButton).toBeEnabled({ timeout: 15000 });

    // Wait for the mock login response to prove the API finished.
    // Use a 200-only wait (as the success signal), but also capture any /mock/login response so we can dump body on non-200.
    const loginResponsePromise = page.waitForResponse(
      (r) => r.url().includes('/mock/login') && r.status() === 200,
      { timeout: 30000 }
    );
    const anyLoginResponsePromise = page.waitForResponse(
      (r) => r.url().includes('/mock/login'),
      { timeout: 30000 }
    );

    console.log('Clicking submit...');
    await submitButton.click();

    let loginResponse;
    try {
      loginResponse = await loginResponsePromise;
    } catch (e) {
      // If we got a non-200 (or never got a response), dump the body to help debugging.
      try {
        const anyResp = await anyLoginResponsePromise;
        const bodyText = await anyResp.text().catch(() => '<unable to read response body>');
        throw new Error(`Mock login returned HTTP ${anyResp.status()}: ${bodyText}`);
      } catch {
        throw e;
      }
    }

    // Assert E2E debug marker proving handler ran.
    await expect(page.locator('body')).toHaveAttribute('data-e2e-submit-clicked', 'true');

    // Primary success signal: E2E marker on <body>.
    await waitForLoginSuccess(page, 30_000);

    // Secondary (best-effort) navigation check.
    // If login succeeded but navigation never occurs, fail with a clear message.
    try {
      await expect(page).not.toHaveURL(/\/sign-in(\?|$)/, { timeout: 10000 });
      console.log(`Redirected away from sign-in. New URL: ${page.url()}`);
    } catch {
      throw new Error(
        `Login succeeded (body[data-e2e-login-api="success"]) but the app did not navigate away from /sign-in within 10s. ` +
          `Current URL: ${page.url()}`
      );
    }

    await page.context().storageState({ path: storageStatePath });
    console.log('Auth state saved successfully.');

    // Final hardening: ensure the generated storageState has *some* persisted auth state.
    expect(fs.existsSync(storageStatePath), `Expected storageState file at: ${storageStatePath}`).toBeTruthy();
    const rawStorageState = fs.readFileSync(storageStatePath, 'utf-8');
    const parsedStorageState = JSON.parse(rawStorageState);
    const hasCookies = Array.isArray(parsedStorageState?.cookies) && parsedStorageState.cookies.length > 0;
    const hasLocalStorage =
      Array.isArray(parsedStorageState?.origins) &&
      parsedStorageState.origins.some(
        (o: any) => Array.isArray(o?.localStorage) && o.localStorage.length > 0
      );
    expect(
      hasCookies || hasLocalStorage,
      'storageState.json should contain at least one cookie or at least one localStorage entry'
    ).toBeTruthy();
  } catch (error) {
    console.error('Auth setup failed:', error);

    // Only try to dump if page is not closed
    if (!page.isClosed()) {
        // Dump page content for debugging
        try {
            const content = await page.content();
            const contentPath = path.resolve(__dirname, '../../test-results/', 'auth-setup-error.html');
            fs.mkdirSync(path.dirname(contentPath), { recursive: true });
            fs.writeFileSync(contentPath, content);
            console.log(`Saved page dump to: ${contentPath}`);
        } catch (dumpError) {
            console.error('Failed to dump page content (likely closed):', dumpError.message);
        }

        // Screenshot
        try {
            const screenshotPath = path.resolve(__dirname, 'auth-setup-failure.png');
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`Saved failure screenshot to: ${screenshotPath}`);
        } catch (shotError) {
             console.error('Failed to take screenshot (likely closed):', shotError.message);
        }
    } else {
        console.error('Page is already closed, cannot dump content/screenshot.');
    }

    throw error;
  }
});
