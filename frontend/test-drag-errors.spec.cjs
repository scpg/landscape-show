const { test } = require('@playwright/test');

test('capture errors when dragging nodes', async ({ page }) => {
  const allMessages = [];
  const pageErrors = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    allMessages.push({ type, text });
    if (type === 'error' || type === 'warning') {
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  });

  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.click('text=Company System Landscape');
  await page.waitForTimeout(3000);

  console.log('\n🖱️  Attempting to drag a node...\n');

  // Try to find and drag a system node
  try {
    // Look for any node with "CRM System" text
    const node = page.locator('text=CRM System').first();
    const box = await node.boundingBox();

    if (box) {
      // Drag the node
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + 50, box.y + 50, { steps: 10 });
      await page.mouse.up();

      console.log('✅ Successfully dragged node\n');
    }
  } catch (e) {
    console.log(`❌ Failed to drag: ${e.message}\n`);
  }

  // Wait a bit for any async errors
  await page.waitForTimeout(2000);

  const errors = allMessages.filter(m => m.type === 'error');
  const warnings = allMessages.filter(m => m.type === 'warning');

  console.log('\n📊 SUMMARY AFTER DRAGGING:');
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  console.log(`   Page Errors: ${pageErrors.length}\n`);
});
