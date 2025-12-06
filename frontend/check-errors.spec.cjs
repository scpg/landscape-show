const { test } = require('@playwright/test');

test('check for Monaco errors', async ({ page }) => {
  const messages = [];
  const errors = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    messages.push({ type, text });
    if (type === 'error' || type === 'warning') {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.click('text=Company System Landscape');

  // Wait longer to see if Monaco loads
  await page.waitForTimeout(5000);

  console.log('\n=== SUMMARY ===');
  console.log(`Total console messages: ${messages.length}`);
  console.log(`Errors: ${messages.filter(m => m.type === 'error').length}`);
  console.log(`Warnings: ${messages.filter(m => m.type === 'warning').length}`);
  console.log(`Page errors: ${errors.length}`);

  if (errors.length === 0 && messages.filter(m => m.type === 'error').length === 0) {
    console.log('\n✅ No errors found!');
  }
});
