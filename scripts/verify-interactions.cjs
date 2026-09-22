const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8788');
      await page.waitForSelector('.surf-transition--active');
      const bounds = await page.evaluate(() => {
        const top = (element) => {
          let value = 0;
          let current = element;
          while (current) {
            value += current.offsetTop;
            current = current.offsetParent;
          }
          return value;
        };
        return {
          start: top(document.getElementById('services')) + 130,
          end: top(document.getElementById('lotion-target')) - innerHeight * .54,
        };
      });
      const phases = new Set();
      for (const progress of [.12, .2, .5, .78, .99]) {
        await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), bounds.start + Math.max(360, bounds.end - bounds.start) * progress);
        await page.waitForTimeout(100);
        phases.add(await page.locator('.sl-lotion-drop').getAttribute('data-phase'));
      }
      assert.ok(phases.has('forming'), `${name} missing forming drop state`);
      assert.ok(phases.has('falling'), `${name} missing falling drop state`);
      assert.ok(phases.has('impact') || phases.has('gone'), `${name} missing impact/drop-away state`);
      await page.locator('.sl-product-duet .sl-product-croissant').scrollIntoViewIfNeeded();
      await page.locator('.sl-product-duet .sl-product-croissant').hover();
      assert.equal(await page.locator('.sl-product-duet .sl-product-croissant').evaluate(element => getComputedStyle(element).animationName), 'product-hover-shake');
      if (name === 'desktop') {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'auto' }));
        await page.waitForTimeout(700);
        await page.locator('.collage-sign-trigger').evaluate(element => element.click());
        await page.waitForSelector('.pull-secret-countdown');
        assert.equal(await page.locator('.pull-secret-countdown strong').textContent(), '5');
        await page.waitForTimeout(5200);
        await page.waitForSelector('.pull-secret-obunga');
        await page.waitForTimeout(5200);
        assert.equal(await page.locator('.pull-secret').count(), 0, 'secret page did not reset to the hero');
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.sl-product-duet .sl-product-croissant').evaluate(element => getComputedStyle(element).animationName), 'none');
      assert.deepEqual(errors, []);
      console.log(name, 'snap pump phases, hover shake, secret reset, reduced motion PASS');
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
