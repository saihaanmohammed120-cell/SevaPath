import { test, expect } from '@playwright/test';

test.describe('UI Resilience & API Failures', () => {

  test('Graceful handling of Guide API 500 Failure', async ({ page }) => {
    // Intercept Copilot API to simulate a 500 error
    await page.route('**/api/copilot/chat', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: "Internal Server Error" })
      });
    });

    await page.goto('http://localhost:3000/discover');
    await page.locator('[data-testid^="discover-result-"]').first().click();
    
    // Open guide and send message
    await page.getByTestId('copilot-toggle').click();
    await page.getByTestId('copilot-input').fill('Help me');
    await page.getByTestId('copilot-send').click();

    // Wait for the UI to handle the error gracefully rather than crashing
    const panel = page.getByTestId('copilot-panel');
    await expect(panel).toContainText('unavailable right now', { ignoreCase: true });
    
    // Verify no provider names (e.g. Gemini, OpenAI) leaked in the error
    const panelText = await panel.textContent();
    expect(panelText).not.toMatch(/Gemini|OpenAI|Anthropic|Traceback/i);
  });

});
