import { test, expect } from '@playwright/test';

const gatedPath = '/user/job-applications';
const loginPath = '/sign-in';

// Not logged in: should redirect to login
// (storageState.json is empty or not used)
test.describe('Gated route access', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(gatedPath);
    await expect(page).toHaveURL(new RegExp(`${loginPath}`));
  });

  test('loads gated route when authenticated', async ({ page }) => {
    // Assumes storageState.json is set up for logged-in user
    await page.goto(gatedPath, { waitUntil: 'domcontentloaded' });
    // Expect some gated content - using app-root as generic fallback if body is too broad, 
    // but body is usually fine. Let's make it robust by waiting for app-root or feature-gate-notice 
    // to ensure angular app loaded.
    await expect(page.locator('app-root')).toBeVisible({ timeout: 15000 });
    
    // Optionally check for absence of login prompt
    await expect(page).not.toHaveURL(new RegExp(`${loginPath}`));
  });
});
