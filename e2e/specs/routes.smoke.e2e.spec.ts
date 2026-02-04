import { test, expect } from '@playwright/test';

const publicRoutes = [
  { path: '/', testId: 'landing-root' },
  { path: '/pricing', testId: 'pricing-root' },
  { path: '/resume-marketplace', testId: 'resume-marketplace-root' },
];

test.describe('Public routes smoke test', () => {
  for (const { path, testId } of publicRoutes) {
    test(`should load ${path} and show stable element`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      // await page.waitForLoadState('networkidle'); // Removed to avoid flaky timeouts
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      const root = page.locator(`[data-testid="${testId}"]`);
      await expect(root).toBeVisible({ timeout: 10000 });
    });
  }
});
