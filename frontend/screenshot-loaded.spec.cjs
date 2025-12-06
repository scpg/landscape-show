const { test, expect } = require('@playwright/test');

test('capture app with loaded landscape', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Wait for the landscape selector to appear
  await page.waitForSelector('text=Company System Landscape', { timeout: 10000 });

  // Click the landscape button to load it
  await page.click('text=Company System Landscape');

  // Wait for the diagram/split view to load
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({
    path: 'app-with-landscape.png',
    fullPage: true
  });

  console.log('\n✅ Screenshot captured: app-with-landscape.png');
  console.log('   Landscape loaded and Phase 3 UI should be visible!\n');
});
