import { expect, test } from '@playwright/test';

const ownerId = '1050';
const userName = 'e2e-user';
const resumeTitle = 'E2E Resume Preview';
const absoluteDocumentUrl = `https://workifence.s3.us-east-1.amazonaws.com/${userName}/wif-resume/e2e-resume-preview.pdf`;

const tinyPdf = Buffer.from(
  '%PDF-1.4\n' +
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n' +
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n' +
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R >>\nendobj\n' +
    '4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 18 Tf 24 120 Td (Resume Preview) Tj ET\nendstream\nendobj\n' +
    'xref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000063 00000 n \n0000000122 00000 n \n0000000212 00000 n \n' +
    'trailer\n<< /Root 1 0 R /Size 5 >>\nstartxref\n305\n%%EOF',
  'utf-8',
);

test.describe('resume save preview', () => {
  test('shows the saved resume preview immediately on the list when save returns an absolute document URL', async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__E2E__ = true;
    });

    await page.route('**/api/wif-login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          emailId: 'e2e@example.com',
          status: 'activated',
          userName,
          username: 'e2e@example.com',
        }),
      });
    });

    await page.route('**/api/authenticate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id_token: 'mock-jwt-token' }),
      });
    });

    await page.route('**/api/account', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: Number(ownerId),
          login: userName,
          firstName: 'E2E',
          lastName: 'User',
          email: 'e2e@example.com',
          imageUrl: null,
          activated: true,
          langKey: 'en',
          authorities: ['ROLE_USER'],
        }),
      });
    });

    await page.route('**/api/login-profile-by-name/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: ownerId, userName, ownerId, imageUrl: '', title: null, summary: null }),
      });
    });

    await page.route('**/api/bio-profile-by-name/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: ownerId, userName, ownerId, imageUrl: '', title: null, summary: null }),
      });
    });

    await page.route('**/api/access/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: ownerId,
          userName,
          mode: 'PERSONAL',
          activeProfileKey: 'USER',
          availableProfiles: [{ key: 'USER', homeRoute: '/user/resumes' }],
        }),
      });
    });

    await page.route('**/api/access/profile/context', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          activeProfileKey: 'USER',
          ownedProfiles: [
            {
              key: 'USER',
              label: 'Personal',
              description: 'Personal profile',
            },
          ],
        }),
      });
    });

    await page.route('**/api/me/entitlements', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ plan: 'FREE', roles: ['ROLE_USER'], entitlements: { RESUME_PORTAL: true, USER_DASHBOARD: true } }),
      });
    });

    await page.route('**/api/entitlements/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          planCode: 'FREE_INDIVIDUAL',
          status: 'ACTIVE',
          roles: ['ROLE_USER'],
          entitlements: {
            RESUME_PORTAL: true,
            USER_DASHBOARD: true,
          },
        }),
      });
    });

    await page.route('**/api/access/nav/menu', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { login: userName }, sections: [] }),
      });
    });

    await page.route('**/api/ext/navbar/my', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route(`**/api/job-resumes?ownerId.equals=${ownerId}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/saveResumeDocument', async route => {
      const payload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'resume-e2e-1',
          title: payload.title,
          description: 'Resume Description',
          documentUrl: absoluteDocumentUrl,
          resumeJson: payload.resumeJson,
          createdDate: payload.createdDate ?? Date.now().toString(),
          lastUpdatedDate: payload.lastUpdatedDate ?? Date.now().toString(),
          resumeCategory: payload.category,
          roleCategory: payload.roleCategory,
          type: '',
          status: payload.status,
          userName: payload.username,
          rating: 0,
          selected: false,
          access: payload.access,
          wish: false,
          lastUsedFor: '',
          templateId: payload.templateId,
          ownerId: payload.ownerId,
          tags: '',
          fileName: payload.current_filename,
          imageBytes: [],
          priority: payload.isPrimary,
        }),
      });
    });

    await page.route('**/api/downloadResume**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: tinyPdf,
      });
    });

    await page.route(absoluteDocumentUrl, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: tinyPdf,
      });
    });

    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

    const loginForm = page.getByTestId('login-form');
    await expect(loginForm).toBeVisible({ timeout: 20000 });
    await page.getByTestId('login-username').fill('e2e@example.com');
    await page.getByTestId('login-password').fill('Password1!');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/user\/resumes$/);

    await expect(page.getByRole('button', { name: 'Add Resume' })).toBeVisible();
    await page.getByRole('button', { name: 'Add Resume' }).click();
    await expect(page).toHaveURL(/\/user\/resumes\/resume$/);

    await page.locator('.sticky-left-toolbox li').filter({ hasText: 'META DATA' }).click();
    await expect(page.getByText('Resume Information')).toBeVisible();

    await page.locator('#title').fill(resumeTitle);

    const roleInput = page.locator('p-autocomplete#roleLevel input').first();
    await roleInput.fill('Software Engineer');
    await roleInput.press('ArrowDown');
    await roleInput.press('Enter');

    const categoryInput = page.locator('p-autocomplete#category input').first();
    await categoryInput.fill('Software Engineer');
    await categoryInput.press('ArrowDown');
    await categoryInput.press('Enter');

    await page.locator('p-dropdown#access').click();
    await page.getByText('Private', { exact: true }).click();

    await page.getByRole('button', { name: 'Save Changes' }).click();

    await page.locator('.sticky-left-toolbox li').nth(6).click();

    await expect(page).toHaveURL(/\/user\/resumes$/);

    const card = page.locator('.single-resume-box').filter({ hasText: resumeTitle });
    await expect(card).toBeVisible({ timeout: 15000 });
    await expect(card.locator('img.cubic-image')).toBeVisible({ timeout: 15000 });
    await expect(card.locator('.resume-image-fallback')).toHaveCount(0);
  });
});
