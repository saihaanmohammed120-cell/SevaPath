import { test, expect } from '@playwright/test';
import { attachConsoleListeners } from './helpers/index.js';

const SERVICE_KEYWORDS = [
  'Aadhaar Address Update',
  'Passport Application',
  'Voter ID',
  'DigiLocker',
  'New PAN',
  'Driving Licence',
  'UAN Activation',
  'Ayushman Bharat',
  'PM YASASVI',
  'PM-USP',
  'NMMS'
];

test.describe('Service Matrix - 11 Production Services', () => {
  for (const keyword of SERVICE_KEYWORDS) {
    test(`End-to-End Navigation & Handoff: ${keyword}`, async ({ page }) => {
      const errors = [];
      const failed = [];
      attachConsoleListeners(page, errors, failed);

      await page.goto('http://localhost:3000/discover');
      
      const card = page.locator('[data-testid^="discover-result-"]').filter({ has: page.locator('h3', { hasText: new RegExp(keyword, 'i') }) }).first();
      await expect(card).toBeVisible({ timeout: 10000 });
      await card.click();

      await expect(page.locator('text=TEST_ONLY')).toHaveCount(0);
      
      // Step 1: Understand
      const understand = page.locator('section[aria-labelledby="stage-understand"]');
      await expect(understand).toBeVisible({ timeout: 10000 });
      await understand.getByTestId('primary-next-action').click();

      // Step 2: Confirm
      const confirm = page.locator('section[aria-labelledby="stage-confirm"]');
      await expect(confirm).toBeVisible({ timeout: 10000 });
      await confirm.getByTestId('primary-next-action').click();

      // Step 3: Eligibility
      const elig = page.locator('section[aria-labelledby="stage-eligibility"]');
      await expect(elig).toBeVisible({ timeout: 10000 });
      
      // Answer all 'Yes'
      const yesButtons = await elig.getByTestId(/eligibility-yes-/).all();
      for (const btn of yesButtons) {
        await btn.click();
      }
      
      // Click 'Check my eligibility' (semantic locator)
      const checkBtn = elig.getByRole('button', { name: /Check my eligibility/i });
      await expect(checkBtn).toBeVisible();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      
      // Wait for verdict to appear
      const verdict = elig.getByTestId('eligibility-verdict');
      await expect(verdict).toBeVisible({ timeout: 10000 });
      
      // Click Continue to next stage
      const eligNext = elig.getByTestId('primary-next-action');
      await expect(eligNext).toBeVisible();
      await eligNext.click();

      // Step 4: Documents
      const docs = page.locator('section[aria-labelledby="stage-documents"]');
      await expect(docs).toBeVisible({ timeout: 10000 });
      await docs.getByTestId('primary-next-action').click();

      // Step 5: Procedure
      const proc = page.locator('section[aria-labelledby="stage-procedure"]');
      await expect(proc).toBeVisible({ timeout: 10000 });
      await proc.getByTestId('primary-next-action').click();

      // Step 6: Application Handoff
      const appStage = page.locator('section[aria-labelledby="stage-application"]');
      await expect(appStage).toBeVisible({ timeout: 10000 });
      
      // Wait for either the application CTA or the unavailable badge
      const applyBtn = appStage.getByTestId('application-cta');
      const appBadge = appStage.getByTestId('application-mode-badge');
      
      await expect(appBadge).toBeVisible({ timeout: 10000 });
      
      if (await applyBtn.isVisible()) {
        const href = await applyBtn.getAttribute('href');
        expect(href, `Missing href for ${keyword}`).toBeTruthy();
        expect(href, `URL must be HTTPS for ${keyword}`).toMatch(/^https:\/\//);
        
        const [newPage] = await Promise.all([
          page.waitForEvent('popup', { timeout: 10000 }).catch(() => null),
          applyBtn.click()
        ]);
        
        if (newPage) {
          // We don't wait for full load to avoid flaky gov sites, just verify it opened.
          console.log(`[PASS] Handoff Destination for ${keyword}: ${href}`);
          await newPage.close();
        }
      }

      expect(errors.length, `Console errors: ${errors.join(', ')}`).toBe(0);
    });
  }
});
