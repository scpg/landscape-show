const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Edge ')) {
      console.log('BROWSER:', text);
    }
  });

  try {
    console.log('Navigating to http://localhost:5174...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 10000 });

    await page.waitForTimeout(2000);

    // Load landscape
    const landscapeButton = page.locator('button:has-text("Company System Landscape")').first();
    if (await landscapeButton.isVisible()) {
      await landscapeButton.click();
      await page.waitForTimeout(3000);
    }

    // Get ALL path elements in the SVG
    console.log('\n=== DETAILED EDGE PATH ANALYSIS ===\n');
    const allPaths = await page.locator('svg path').all();
    console.log(`Found ${allPaths.length} total <path> elements\n`);

    for (let i = 0; i < allPaths.length; i++) {
      const path = allPaths[i];
      const id = await path.getAttribute('id');
      const d = await path.getAttribute('d');
      const stroke = await path.getAttribute('stroke');
      const strokeWidth = await path.getAttribute('stroke-width');
      const strokeDasharray = await path.getAttribute('stroke-dasharray');
      const fill = await path.getAttribute('fill');
      const className = await path.getAttribute('class');

      if (!id || !d) continue; // Skip non-edge paths

      console.log(`Path ${i} (id: ${id}):`);
      console.log(`  class: ${className}`);
      console.log(`  stroke: ${stroke}`);
      console.log(`  stroke-width: ${strokeWidth}`);
      console.log(`  stroke-dasharray: ${strokeDasharray}`);
      console.log(`  fill: ${fill}`);
      console.log(`  d: ${d.substring(0, 60)}...`);

      // Determine path type
      const hasC = d.includes('C');
      const hasL = d.includes('L');
      let pathType = 'unknown';
      if (hasC && !hasL) pathType = 'BEZIER (curved)';
      else if (hasL && !hasC) pathType = 'STRAIGHT/STEP (angular)';
      else if (hasC && hasL) pathType = 'SMOOTHSTEP (mixed)';

      console.log(`  → Path Type: ${pathType}`);

      // Determine line style
      let lineStyle = 'SOLID';
      if (strokeDasharray) {
        if (strokeDasharray.includes('8')) lineStyle = 'DASHED';
        else if (strokeDasharray.includes('2')) lineStyle = 'DOTTED';
      }
      console.log(`  → Line Style: ${lineStyle}`);
      console.log('');
    }

    await page.screenshot({ path: 'edge-detailed-test.png', fullPage: true });
    console.log('Screenshot: edge-detailed-test.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    console.log('\nClosing in 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
