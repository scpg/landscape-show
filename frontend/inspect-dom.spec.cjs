const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const landscapeButton = page.locator('button:has-text("Company System Landscape")').first();
    if (await landscapeButton.isVisible()) {
      await landscapeButton.click();
      await page.waitForTimeout(3000);
    }

    // Get the actual HTML of one edge path
    const edgePath = page.locator('#crm-system-billing-system').first();
    const html = await edgePath.evaluate(el => el.outerHTML);
    console.log('\n=== RAW HTML of first edge path ===');
    console.log(html);
    console.log('\n');

    // Get all attributes
    const attrs = await edgePath.evaluate(el => {
      const result = {};
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        result[attr.name] = attr.value;
      }
      return result;
    });
    console.log('=== All attributes ===');
    console.log(JSON.stringify(attrs, null, 2));

    // Check computed styles
    const styles = await edgePath.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        stroke: computed.stroke,
        strokeWidth: computed.strokeWidth,
        strokeDasharray: computed.strokeDasharray,
      };
    });
    console.log('\n=== Computed styles ===');
    console.log(JSON.stringify(styles, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await page.waitForTimeout(10000);
    await browser.close();
  }
})();
