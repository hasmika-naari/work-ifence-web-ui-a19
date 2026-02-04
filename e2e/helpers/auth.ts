import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export async function waitForLoginSuccess(page: Page, timeoutMs = 30_000): Promise<void> {
  const body = page.locator('body');

  try {
    await expect(body).toHaveAttribute('data-e2e-login-api', 'success', { timeout: timeoutMs });
  } catch {
    const currentApi = await body.getAttribute('data-e2e-login-api').catch(() => null);
    const submitClicked = await body.getAttribute('data-e2e-submit-clicked').catch(() => null);
    const errMsg =
      `Timed out waiting for login success marker: body[data-e2e-login-api="success"] within ${timeoutMs}ms. ` +
      `Current URL: ${page.url()} (data-e2e-login-api=${currentApi ?? '<missing>'}, data-e2e-submit-clicked=${submitClicked ?? '<missing>'})`;
    throw new Error(errMsg);
  }
}

export async function waitForAngularStable(page: Page, timeoutMs = 10_000): Promise<void> {
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

// Example: set JWT token in localStorage for test user
export async function setAuthToken(page: Page, token: string) {
  await page.addInitScript((token) => {
    window.localStorage.setItem('jwt', token);
  }, token);
}

// Example: login via UI and save storageState
export async function loginViaUI(page: Page, { username, password }: { username: string, password: string }) {
  // 1. Wait for the sign-in form using: data-testid="login-form"
  const loginForm = page.getByTestId('login-form');
  await expect(loginForm).toBeVisible({ timeout: 20000 });

  // Selectors
  // Support either SignInComponent (login-email) or legacy LoginPageComponent (login-username)
  const emailInput = page.getByTestId('login-email').or(page.getByTestId('login-username')).first();
  const passwordInput = page.getByTestId('login-password');
  const submitButton = page.getByTestId('login-submit');

  // 2. Trigger real user behavior (click -> fill -> tab) for inputs
  console.log('Counting inputs...');
  await expect(emailInput).toBeVisible({ timeout: 10000 });
  await expect(emailInput).toBeEditable({ timeout: 10000 });
  
  console.log('Filling email...');
  await emailInput.focus();
  await emailInput.fill(username);
  await page.keyboard.press('Tab'); // Trigger validation

  console.log('Filling password...');
  await expect(passwordInput).toBeEditable({ timeout: 5000 });
  await passwordInput.focus();
  await passwordInput.fill(password);
  await page.keyboard.press('Tab'); // Trigger validation
  
  // 3. Wait explicitly until submit button becomes enabled
  console.log('Waiting for submit button to enable...');
  try {
    await expect(submitButton).toBeEnabled({ timeout: 15000 });
  } catch (e) {
    console.error('Login button remained disabled.');
    
    // Capture validation errors from the container
    const errors = await page.locator('[data-testid^="login-error-"]').allTextContents();
    const errorText = errors.join('; ');

    const timestamp = Date.now();
    // take a screenshot
    const screenshotPath = path.resolve(__dirname, `../../test-results/login-disabled-failure-${timestamp}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    // capture page content
    const content = await page.content();
    const contentPath = path.resolve(__dirname, `../../test-results/login-disabled-dump-${timestamp}.html`);
    fs.mkdirSync(path.dirname(contentPath), { recursive: true });
    fs.writeFileSync(contentPath, content);

    console.log(`Saved screenshot to: ${screenshotPath}`);
    console.log(`Saved dump to: ${contentPath}`);

    // throw Error
    throw new Error(`Login submit disabled. Validation errors: ${errorText}`);
  }

  // 4. Only click when enabled
  console.log('Clicking submit...');
  await submitButton.click();

  // Primary login success signal
  await waitForLoginSuccess(page, 30_000);

  // Secondary navigation check (best-effort)
  await expect(page).not.toHaveURL(/\/sign-in/, { timeout: 10000 });
}
