const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:5175');

  // Wait for React Flow to load
  await page.waitForTimeout(3000);

  // Get edge elements
  const edges = await page.locator('.react-flow__edge-path').all();

  console.log(`Found ${edges.length} edges`);

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const strokeDasharray = await edge.getAttribute('stroke-dasharray');
    const d = await edge.getAttribute('d');
    const pathType = d.startsWith('M') && d.includes('C') ? 'bezier' :
                     d.startsWith('M') && d.includes('L') && !d.includes('C') ? 'straight' :
                     'other';

    console.log(`Edge ${i}: strokeDasharray="${strokeDasharray}", pathType="${pathType}"`);
  }

  await page.screenshot({ path: 'edge-rendering-debug.png', fullPage: true });

  await page.waitForTimeout(5000);
  await browser.close();
})();
