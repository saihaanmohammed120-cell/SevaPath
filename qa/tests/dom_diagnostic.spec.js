import { test } from '@playwright/test';

test('DOM Diagnostic Investigation', async ({ page }) => {
  await page.goto('http://localhost:3000/discover');
  
  // Click the first available service (Aadhaar Address Update usually)
  const firstResult = page.locator('[data-testid^="discover-result-"]').first();
  await firstResult.waitFor({ state: 'visible' });
  await firstResult.click();
  
  // Wait for the journey page to fully settle
  await page.waitForTimeout(3000);

  console.log('\n==================================================');
  console.log('=== DOM DIAGNOSTIC DUMP ===');
  console.log(`Current URL: ${page.url()}`);
  
  const allElements = await page.evaluate(() => {
    const results = [];
    const walk = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const testid = node.getAttribute('data-testid');
        
        if (testid && (testid.startsWith('stage-') || testid.includes('next') || testid.includes('action'))) {
          // Find all ancestors that also have a data-testid to establish DOM relationships
          let current = node.parentElement;
          const ancestors = [];
          while (current) {
            const ptid = current.getAttribute('data-testid');
            if (ptid) ancestors.push(ptid);
            current = current.parentElement;
          }
          
          results.push({
            tagName: node.tagName.toLowerCase(),
            testid: testid,
            ancestor_testids: ancestors,
            visible_text: (node.innerText || '').replace(/\s+/g, ' ').trim().substring(0, 60)
          });
        }
      }
      for (const child of node.childNodes) {
        walk(child);
      }
    };
    walk(document.body);
    return results;
  });

  console.log(JSON.stringify(allElements, null, 2));
  console.log('==================================================\n');
});
