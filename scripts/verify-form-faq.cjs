const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3001';

async function fillInquiry(page, status) {
  await page.route('**/api/inquiry', route => route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(status === 200 ? { ok: true } : { error: 'server_error' }),
  }));
  await page.goto(base + '/#contact');
  const next = page.getByRole('button', { name: /Continue to next step/ });
  await next.click();
  assert.match(await page.locator('#name').evaluate(e => e.validationMessage), /fill out this field/i);
  assert.match(await page.getByText('Step 1 of 3').textContent(), /Step 1/);
  await page.locator('#name').fill('Test Visitor');
  await page.locator('#company').fill('Test Brand');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#productCategory').selectOption('Apparel / Clothing');
  await page.locator('#monthlyVolume').selectOption('100 – 500 orders/month');
  await next.click();
  await page.getByText('Step 2 of 3').waitFor();
  await next.click();
  assert.match(await page.locator('#phone').evaluate(e => e.validationMessage), /fill out this field/i);
  await page.locator('#phone').fill('555-000-0000');
  await page.locator('#currentMethod').selectOption('Self-fulfilling from home');
  await next.click();
  await page.getByText('Step 3 of 3').waitFor();
  await page.locator('#challenge').fill('Need help with fulfillment');
  await page.getByRole('button', { name: 'Get Free Fulfillment Consultation' }).click();
  await page.getByText(status === 200 ? /We.ve received your inquiry/ : /Something went wrong/).waitFor();
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      for (const status of [200, 500]) {
        const page = await browser.newPage({ viewport: { width, height } });
        await fillInquiry(page, status);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.close();
      }
      const page = await browser.newPage({ viewport: { width, height } });
      let requests = 0;
      await page.route('**/api/faq-chat', route => {
        requests++;
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ answer: 'Ask us about your products.', referred: false }) });
      });
      await page.goto(base + '/#faq');
      await page.getByRole('textbox', { name: 'Type your question here' }).fill('What is 3PL?');
      await page.getByRole('button', { name: 'Send question' }).click();
      await page.getByText(/third-party logistics/i).waitFor();
      assert.equal(requests, 0, 'preset answer must stay local');
      await page.getByRole('textbox', { name: 'Type your question here' }).fill('Can you handle a new product?');
      await page.getByRole('button', { name: 'Send question' }).click();
      await page.getByText('Ask us about your products.').waitFor();
      assert.equal(requests, 1);
      await page.unroute('**/api/faq-chat');
      await page.route('**/api/faq-chat', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
      await page.getByRole('textbox', { name: 'Type your question here' }).fill('Another custom question?');
      await page.getByRole('button', { name: 'Send question' }).click();
      await page.getByText(/answer tool is unavailable/i).waitFor();
      await page.getByRole('link', { name: /Go to the consultation form/ }).waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.close();
      console.log(name, 'form validation/success/failure and FAQ preset/custom/error PASS');
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
