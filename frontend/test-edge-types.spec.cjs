const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    console.log('BROWSER LOG:', msg.text());
  });

  try {
    console.log('Navigating to http://localhost:5174...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 10000 });

    console.log('Waiting for landscape to load...');
    await page.waitForTimeout(2000);

    // Click on the first landscape button
    console.log('Loading landscape...');
    const landscapeButton = page.locator('button:has-text("Company System Landscape")').first();
    if (await landscapeButton.isVisible()) {
      await landscapeButton.click();
      await page.waitForTimeout(2000);
      console.log('Landscape loaded');
    }

    // Get all the edge paths and their properties
    console.log('\n=== EDGE ANALYSIS ===');
    const edges = await page.locator('.react-flow__edge').all();
    console.log(`Found ${edges.length} edges`);

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const edgeId = await edge.getAttribute('data-id') || `edge-${i}`;
      const path = await edge.locator('path').first();
      const pathD = await path.getAttribute('d');
      const strokeDasharray = await path.getAttribute('stroke-dasharray');
      const stroke = await path.getAttribute('stroke');

      console.log(`\nEdge ${edgeId}:`);
      console.log(`  - Stroke: ${stroke}`);
      console.log(`  - Dash array: ${strokeDasharray}`);
      console.log(`  - Path (first 50 chars): ${pathD?.substring(0, 50)}...`);

      // Analyze path type based on commands
      if (pathD) {
        const hasC = pathD.includes('C'); // Cubic bezier
        const hasL = pathD.includes('L'); // Line
        const hasQ = pathD.includes('Q'); // Quadratic bezier

        let pathType = 'unknown';
        if (hasC && !hasL) pathType = 'bezier';
        else if (hasL && !hasC) pathType = 'straight/step';
        else if (hasC && hasL) pathType = 'smoothstep';

        console.log(`  - Detected path type: ${pathType}`);
      }
    }

    // Take a screenshot
    await page.screenshot({ path: 'edge-types-test.png', fullPage: true });
    console.log('\nScreenshot saved as edge-types-test.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    console.log('\nTest complete. Browser will close in 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
