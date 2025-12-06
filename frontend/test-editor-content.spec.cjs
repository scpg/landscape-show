const { test } = require('@playwright/test');

test('check what appears in editor area', async ({ page }) => {
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.click('text=Company System Landscape');

  // Wait longer for Monaco to load
  await page.waitForTimeout(5000);

  // Check what text is visible in the right pane
  const rightPane = page.locator('div').filter({ hasText: /Loading|metadata|systems/ }).first();
  const content = await rightPane.textContent();

  console.log('\n=== RIGHT PANE CONTENT ===');
  console.log(content);

  // Try to find Monaco editor
  const monacoEditor = page.locator('.monaco-editor');
  const monacoExists = await monacoEditor.count();
  console.log(`\nMonaco editor elements found: ${monacoExists}`);

  // Check if there's actual YAML content
  const yamlContent = page.locator('text=/metadata:.*title:/');
  const hasYaml = await yamlContent.count();
  console.log(`YAML content visible: ${hasYaml > 0 ? 'YES' : 'NO'}`);

  // Take another screenshot
  await page.screenshot({ path: 'editor-debug.png', fullPage: true });
  console.log('\nScreenshot saved: editor-debug.png\n');
});
