import { test, expect } from '@playwright/test';

test('minimal Firefox smoke test', async ({ page }) => {
  const errors = [];
  const failedRequests = [];

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Listen for failed network requests
  page.on('requestfailed', request => {
    failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`);
  });

  // Navigate to application
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000');
  
  // Wait for the application to load (goal input field)
  await expect(page.getByTestId('goal-input')).toBeVisible({ timeout: 10000 });

  // Capture screenshot
  await page.screenshot({ path: 'firefox_home.png', fullPage: true });
  
  console.log('Smoke test completed successfully.');
  console.log(`Console errors: ${errors.length}`);
  console.log(`Failed requests: ${failedRequests.length}`);
});
