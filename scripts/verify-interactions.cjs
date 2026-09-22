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
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
      await page.mouse.wheel(0, 1);
      await page.waitForTimeout(2200);
      assert.equal(await page.locator('.surf-transition').getAttribute('data-transition'), 'complete');
      const completeY = await page.evaluate(() => window.scrollY);
      await page.mouse.wheel(0, 160);
      await page.waitForTimeout(120);
      assert.ok((await page.evaluate(() => window.scrollY)) > completeY, 'downward scroll remained captured after wave completion');
      const completionVisuals = await page.evaluate(() => ({
        canvasOpacity: getComputedStyle(document.querySelector('.surf-canvas')).opacity,
        sceneOpacity: getComputedStyle(document.querySelector('.surf-scene')).opacity,
        storyTransform: document.querySelector('.sl-story').style.transform,
      }));
      assert.equal(completionVisuals.canvasOpacity, '0', 'wave canvas remained visible after completion');
      assert.equal(completionVisuals.sceneOpacity, '0', 'hero scene remained visible after completion');
      assert.equal(completionVisuals.storyTransform, '', 'pink content retained an inline transition transform after completion');
      await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'auto' }));
      await page.waitForTimeout(250);
      await page.mouse.wheel(0, -160);
      await page.waitForTimeout(2200);
      assert.ok((await page.evaluate(() => window.scrollY)) <= 2, 'upward wave scroll did not snap to the top');
      assert.equal(await page.locator('.surf-transition').getAttribute('data-transition'), 'idle');
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
            start: top(document.getElementById('services')),
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
        await page.locator('.sl-local-sign-trigger').evaluate(element => element.click());
        await page.waitForSelector('.pull-secret-countdown');
        assert.equal(await page.locator('.pull-secret-countdown strong').textContent(), '00:05');
        assert.match(await page.locator('.pull-secret-loader-image').getAttribute('src'), /sorry-bro-loader\.png$/);
        await page.waitForTimeout(5200);
        await page.waitForSelector('.pull-secret-obunga');
        assert.match(await page.locator('.pull-secret').evaluate(element => getComputedStyle(element).backgroundImage), /warehouse-background\.jpg/);
        assert.equal(await page.locator('audio[src*="construction"]').evaluate(element => element.paused), true);
        assert.equal(await page.locator('audio[src*="eerie"]').evaluate(element => element.paused), false);
        assert.equal(await page.locator('.pull-secret-obunga').evaluate(element => getComputedStyle(element).opacity), '1');
        const firstObungaTransform = await page.locator('.pull-secret-obunga').evaluate(element => getComputedStyle(element).transform);
        await page.waitForTimeout(800);
        assert.notEqual(await page.locator('.pull-secret-obunga').evaluate(element => getComputedStyle(element).transform), firstObungaTransform, 'Obunga did not continuously move');
        await page.waitForTimeout(4400);
        assert.equal(await page.locator('.pull-secret').count(), 0, 'secret page did not reset to the hero');
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('.sl-product-duet .sl-product-croissant').evaluate(element => getComputedStyle(element).animationName), 'none');
      assert.deepEqual(errors, []);
      console.log(name, 'wave direction, pump phases, hover shake, secret reset, reduced motion PASS');
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
