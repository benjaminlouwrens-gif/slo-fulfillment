const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8789';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    for (const [name, width, height] of [['wide', 1440, 900], ['laptop', 1280, 720], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(base);
      await page.waitForSelector('.surf-transition--active');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `/tmp/slocal-after-${name}.png` });
      const artwork = await page.evaluate(() => ({
        warehouse: document.querySelector('.collage-warehouse-cutout').currentSrc,
        sign: getComputedStyle(document.querySelector('.collage-sign-cutout')).display,
        palms: document.querySelectorAll('.collage-palm-additional').length,
        strip: document.querySelector('.sl-route'),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      assert.equal(artwork.palms, 1);
      assert.equal(artwork.strip, null);
      assert.equal(artwork.overflow, false);
      assert.match(artwork.warehouse, name === 'mobile' ? /warehouse-building-reference/ : /warehouse-no-text-desktop/);
      assert.equal(artwork.sign === 'none', name !== 'mobile');
      for (const progress of [.18, .4, .65, .9, .4]) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), height * 2 * progress);
        await page.waitForFunction(() => {
          const c = document.querySelector('.surf-canvas');
          return c.dataset.frame === c.dataset.renderedFrame;
        });
        await page.waitForTimeout(150);
        const sample = await page.evaluate(() => {
          const c = document.querySelector('.surf-canvas');
          const bytes = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
          let painted = 0;
          for (let i = 3; i < bytes.length; i += 4) if (bytes[i] > 0) painted++;
          return {
            frame: +c.dataset.renderedFrame,
            cache: +c.dataset.cachedFrames,
            painted,
            total: c.width * c.height,
            storyTransform: document.querySelector('.sl-story').style.transform,
          };
        });
        assert.equal(sample.storyTransform, '', `${name}: surf renderer moved the full story at ${progress}`);
        if (progress < .8) assert.ok(sample.painted > 1000, `${name}: blank surf at ${progress}`);
        if (progress >= .9) assert.equal(sample.painted, 0, `${name}: surf should have revealed the pink section`);
        assert.ok(sample.cache <= (name === 'mobile' ? 14 : 24));
        await page.screenshot({ path: `/tmp/slocal-${name}-surf-${progress}.png` });
        const frozen = await page.locator('.surf-canvas').getAttribute('data-rendered-frame');
        await page.waitForTimeout(200);
        assert.equal(await page.locator('.surf-canvas').getAttribute('data-rendered-frame'), frozen);
      }
      for (const p of [.05, .72, .2, .95, .35]) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), height * 2 * p);
        await page.waitForTimeout(20);
      }
      await page.waitForFunction(() => {
        const c = document.querySelector('.surf-canvas');
        return c.dataset.frame === c.dataset.renderedFrame;
      });
      if (name === 'mobile') await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      await page.locator('header').getByRole('button', { name: 'How It Works', exact: true }).first().click();
      await page.waitForTimeout(1200);
      await page.evaluate(() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'instant' }));
      await page.waitForTimeout(150);
      assert.ok(Math.abs(await page.locator('#how-it-works').evaluate(e => e.getBoundingClientRect().top) - 80) < 2);
      await page.locator('.sl-local').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `/tmp/slocal-local-${name}.png` });
      const offscreen = await page.locator('.sl-intro .sl-product-fruit').evaluate(e => getComputedStyle(e).animationPlayState);
      assert.equal(offscreen, 'paused');
      await page.setViewportSize({ width: width - 30, height: height - 30 });
      await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }));
      await page.waitForTimeout(350);
      assert.deepEqual(errors, []);
      results.push({ name, artwork, checks: 'forward/reverse/frozen frames, bounded cache, nonblank pixels, anchors, resize' });
      await page.close();
    }
    for (const scenario of ['reduced', 'missing', 'anchor']) {
      const page = await browser.newPage({ reducedMotion: scenario === 'reduced' ? 'reduce' : 'no-preference' });
      if (scenario === 'missing') await page.route('**/assets/surf/**/*.webp', route => route.abort());
      await page.goto(base + (scenario === 'anchor' ? '/#how-it-works' : ''));
      await page.waitForTimeout(1200);
      if (scenario === 'anchor') assert.ok(Math.abs(await page.locator('#how-it-works').evaluate(e => e.getBoundingClientRect().top) - 80) < 2);
      else assert.equal(await page.locator('.surf-transition--active').count(), 0);
      results.push({ scenario, passed: true });
      await page.close();
    }
    await fs.writeFile('/tmp/slocal-verification.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exit(1); });
