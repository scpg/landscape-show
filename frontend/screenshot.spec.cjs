const { test, expect } = require('@playwright/test');

test('capture landscape app screenshot', async ({ page }) => {
  // Capture console messages and errors
  const messages = [];
  page.on('console', msg => {
    messages.push(`[${msg.type()}] ${msg.text()}`);
  });

  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  // Navigate to the app
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait a bit for React to render
  await page.waitForTimeout(2000);

  // Take full page screenshot
  await page.screenshot({
    path: 'app-screenshot.png',
    fullPage: true
  });

  console.log('\n=== SCREENSHOT CAPTURED: app-screenshot.png ===\n');

  // Log console messages
  if (messages.length > 0) {
    console.log('\n=== BROWSER CONSOLE MESSAGES ===');
    messages.forEach(msg => console.log(msg));
  }

  // Log errors
  if (errors.length > 0) {
    console.log('\n=== BROWSER ERRORS ===');
    errors.forEach(err => console.log(err));
  } else {
    console.log('\n✅ No browser errors detected!');
  }
});
