/**
 * Debug test to capture console logs and understand why highlighting isn't working
 */

const { test } = require('@playwright/test');

test('Debug highlighting - capture all console logs', async ({ page }) => {
  const logs = [];

  // Capture all console messages
  page.on('console', msg => {
    const text = msg.text();
    logs.push(text);
    console.log('BROWSER:', text);
  });

  // Navigate and load landscape
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.click('text=Company System Landscape');

  // Switch to split view
  await page.click('button:has-text("Split View")');
  await page.waitForTimeout(3000);

  console.log('\n=== INITIAL LOGS ===');
  logs.forEach(log => console.log(log));
  logs.length = 0; // Clear for next phase

  console.log('\n=== CLICKING FIRST NODE ===');
  const firstNode = page.locator('.react-flow__node').first();
  await firstNode.click();
  await page.waitForTimeout(2000);

  console.log('\n=== LOGS AFTER NODE CLICK ===');
  logs.forEach(log => console.log(log));

  // Take screenshot
  await page.screenshot({
    path: 'errors-and-logs/debug-highlighting.png',
    fullPage: true
  });
  console.log('\n📸 Screenshot saved: errors-and-logs/debug-highlighting.png\n');

  // Print summary
  const yamlMapperLogs = logs.filter(l => l.includes('[YamlLineMapper]'));
  const editorLogs = logs.filter(l => l.includes('[YamlEditor]'));
  const diagramLogs = logs.filter(l => l.includes('[DiagramCanvas]'));

  console.log('\n=== SUMMARY ===');
  console.log(`YamlLineMapper logs: ${yamlMapperLogs.length}`);
  console.log(`YamlEditor logs: ${editorLogs.length}`);
  console.log(`DiagramCanvas logs: ${diagramLogs.length}`);

  if (yamlMapperLogs.length > 0) {
    console.log('\n=== YamlLineMapper ===');
    yamlMapperLogs.forEach(log => console.log(log));
  }
});
