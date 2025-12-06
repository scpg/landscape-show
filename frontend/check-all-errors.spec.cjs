const { test } = require('@playwright/test');

test('capture all browser console errors', async ({ page }) => {
  const allMessages = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    allMessages.push({ type, text });
  });

  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.click('text=Company System Landscape');
  await page.waitForTimeout(5000);

  console.log('\n========================================');
  console.log('BROWSER CONSOLE OUTPUT');
  console.log('========================================\n');

  // Show all messages by type
  const errors = allMessages.filter(m => m.type === 'error');
  const warnings = allMessages.filter(m => m.type === 'warning');
  const logs = allMessages.filter(m => m.type === 'log' || m.type === 'info');

  if (errors.length > 0) {
    console.log('🔴 ERRORS:');
    errors.forEach(e => console.log(`   ${e.text}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`   ${w.text}`));
    console.log('');
  }

  if (pageErrors.length > 0) {
    console.log('❌ PAGE ERRORS:');
    pageErrors.forEach(e => console.log(`   ${e}`));
    console.log('');
  }

  console.log('📊 SUMMARY:');
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  console.log(`   Page Errors: ${pageErrors.length}`);
  console.log(`   Total Messages: ${allMessages.length}`);
  console.log('\n========================================\n');
});
