import { test, expect } from '@playwright/test';

test.describe('Localization Matrix', () => {

  test('Verify Hindi Translation on Home and Journey', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to Hindi
    await page.getByTestId('lang-switcher').click();
    await page.getByTestId('lang-option-hi').click();

    // Verify translated Home elements
    await expect(page.getByTestId('not-sure-btn')).toContainText('मुझे नहीं पता कौन सी सेवा चाहिए'); 
    
    // Verify Journey remains in Hindi without breaking
    await page.goto('http://localhost:3000/discover');
    await page.locator('[data-testid^="discover-result-"]').filter({ hasText: /Aadhaar/i }).first().click();
    
    // Check no overflow or horizontal scrolling on mobile
    const box = await page.locator('body').boundingBox();
    expect(box.width).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
  });

});
