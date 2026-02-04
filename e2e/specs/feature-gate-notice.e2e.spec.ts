import { test, expect } from '@playwright/test';

const gatedPath = '/user/job-applications';
const publicPath = '/';

const noticeSelector = '[data-testid="feature-gate-notice"]';
const deniedMessage = /subscription required|upgrade|login required|entitlement/i;

// This test assumes the gated route triggers a denial for the test user

test.describe('FeatureGateNotice', () => {
  test('shows and hides notice on gated route', async ({ page }) => {
    // Go to gated route (not entitled)
    await page.goto(gatedPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(noticeSelector)).toBeVisible({ timeout: 15000 });
    await expect(page.locator(noticeSelector)).toContainText(deniedMessage);

    // Navigate away to public route
    await page.goto(publicPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(noticeSelector)).toBeHidden();
  });
});
