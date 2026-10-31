import { test, expect } from '@playwright/test';

test.describe('Eligibility Deterministic Logic', () => {

  test('Negative path and recovery', async ({ page }) => {
    await page.goto('http://localhost:3000/discover');
    await page.locator('[data-testid^="discover-result-"]').filter({ hasText: /Passport Application/i }).first().click();
    
    // Navigate to Eligibility stage
    const understand = page.locator('section[aria-labelledby="stage-understand"]');
    await expect(understand).toBeVisible();
    await understand.getByTestId('primary-next-action').click(); 
    
    const confirm = page.locator('section[aria-labelledby="stage-confirm"]');
    await expect(confirm).toBeVisible();
    await confirm.getByTestId('primary-next-action').click(); 
    
    const elig = page.locator('section[aria-labelledby="stage-eligibility"]');
    await expect(elig).toBeVisible();
    
    // Check my eligibility button is disabled until answered
    const checkBtn = elig.getByRole('button', { name: /Check my eligibility/i });
    await expect(checkBtn).toBeDisabled();

    // Fill all with Yes to satisfy the complete check
    const yesButtons = await elig.getByTestId(/eligibility-yes-/).all();
    for (const btn of yesButtons) {
      await btn.click();
    }
    
    // Change first answer to No (Disqualifying path)
    const noBtn = elig.getByTestId(/eligibility-no-/).first();
    await noBtn.click();
    
    // Check button is now enabled because all questions are answered
    await expect(checkBtn).toBeEnabled();
    await checkBtn.click();
    
    // Expect failure UI
    const verdict = elig.getByTestId('eligibility-verdict');
    await expect(verdict).toBeVisible();
    await expect(verdict).toContainText('this may not apply right now', { ignoreCase: true });
    
    // Recovery path: Change back to Yes
    const yesBtn = elig.getByTestId(/eligibility-yes-/).first();
    await yesBtn.click();
    await expect(checkBtn).toBeEnabled();
    await checkBtn.click(); // Re-check
    
    // Check that recovery is successful
    await expect(verdict).toBeVisible();
    await expect(verdict).toContainText("Looks like you're eligible", { ignoreCase: true });
  });

});
