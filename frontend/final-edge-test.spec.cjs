const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Loading application...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const landscapeButton = page.locator('button:has-text("Company System Landscape")').first();
    if (await landscapeButton.isVisible()) {
      await landscapeButton.click();
      await page.waitForTimeout(3000);
    }

    console.log('\n========================================');
    console.log('  EDGE TYPES VERIFICATION');
    console.log('========================================\n');

    // Check each edge
    const edgeTests = [
      { id: 'crm-system-billing-system', expectedType: 'bezier/default', expectedStyle: 'solid' },
      { id: 'crm-system-main-database', expectedType: 'straight', expectedStyle: 'solid' },
      { id: 'billing-system-main-database', expectedType: 'step', expectedStyle: 'solid' },
      { id: 'billing-system-external-payment', expectedType: 'smoothstep', expectedStyle: 'dashed' },
      { id: 'inventory-system-main-database', expectedType: 'bezier', expectedStyle: 'solid' },
      { id: 'inventory-system-billing-system', expectedType: 'straight', expectedStyle: 'dotted' },
      { id: 'main-database-analytics-platform', expectedType: 'smoothstep', expectedStyle: 'dashed' },
    ];

    for (const test of edgeTests) {
      const path = page.locator(`#${test.id}`).first();
      if (!(await path.isVisible())) {
        console.log(`❌ ${test.id}: NOT VISIBLE`);
        continue;
      }

      const d = await path.getAttribute('d');
      const style = await path.getAttribute('style');

      // Determine actual type from path
      const hasC = d.includes('C');
      const hasL = d.includes('L');
      let actualType = 'unknown';
      if (hasC && !hasL) actualType = 'bezier';
      else if (hasL && !hasC) actualType = 'straight/step';
      else if (hasC && hasL) actualType = 'smoothstep';

      // Determine actual line style
      let actualStyle = 'solid';
      if (style.includes('stroke-dasharray: 8')) actualStyle = 'dashed';
      else if (style.includes('stroke-dasharray: 2')) actualStyle = 'dotted';
      else if (style.includes('stroke-dasharray: 0')) actualStyle = 'solid';

      const typeMatch = actualType.includes(test.expectedType.split('/')[0]);
      const styleMatch = actualStyle === test.expectedStyle;

      const typeIcon = typeMatch ? '✅' : '❌';
      const styleIcon = styleMatch ? '✅' : '❌';

      console.log(`${test.id}:`);
      console.log(`  ${typeIcon} Type: ${actualType} (expected: ${test.expectedType})`);
      console.log(`  ${styleIcon} Style: ${actualStyle} (expected: ${test.expectedStyle})`);
      console.log('');
    }

    console.log('========================================');
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'FINAL-edge-types-verified.png', fullPage: true });
    console.log('Screenshot saved: FINAL-edge-types-verified.png');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
