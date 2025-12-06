const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('http://localhost:5175');

  // Click the landscape button
  await page.click('button:has-text("Company System Landscape")');

  // Wait for React Flow to load
  await page.waitForTimeout(3000);

  // Get edge elements
  const edges = await page.locator('.react-flow__edge-path').all();

  console.log(`\nFound ${edges.length} edges\n`);

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const strokeDasharray = await edge.getAttribute('stroke-dasharray');
    const d = await edge.getAttribute('d');

    // Determine path type
    let pathType = 'unknown';
    if (d) {
      if (d.includes('C')) {
        pathType = 'bezier (curved)';
      } else if (d.includes('L') && !d.includes('C')) {
        if (d.split('L').length > 3) {
          pathType = 'step/smoothstep';
        } else {
          pathType = 'straight';
        }
      }
    }

    // Determine line style
    let lineStyle = 'solid';
    if (strokeDasharray === '8, 4' || strokeDasharray === '8,4') {
      lineStyle = 'dashed';
    } else if (strokeDasharray === '2, 2' || strokeDasharray === '2,2') {
      lineStyle = 'dotted';
    }

    console.log(`Edge ${i + 1}:`);
    console.log(`  Line style: ${lineStyle} (strokeDasharray="${strokeDasharray}")`);
    console.log(`  Path type: ${pathType}`);
    console.log('');
  }

  await page.screenshot({ path: 'edge-check-loaded.png', fullPage: true });

  await page.waitForTimeout(5000);
  await browser.close();
})();
