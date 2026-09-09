const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const config = require('../playwright.config');

test('standard user can buy one selected product', { timeout: config.timeout }, async () => {
  const browser = await chromium.launch({ headless: config.headless });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(config.baseURL);
    await page.locator('[data-test="username"]').fill(config.username);
    await page.locator('[data-test="password"]').fill(config.password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/\/inventory\.html$/);
    assert.equal(await page.locator('[data-test="title"]').innerText(), 'Products');
    const product = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
    assert.equal(await product.locator('[data-test="inventory-item-price"]').innerText(), '$29.99');
    await product.getByRole('button', { name: 'Add to cart' }).click();
    assert.equal(await page.locator('[data-test="shopping-cart-badge"]').innerText(), '1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    assert.equal(await page.locator('[data-test="inventory-item-name"]').innerText(), 'Sauce Labs Backpack');
    assert.equal(await page.locator('[data-test="inventory-item-price"]').innerText(), '$29.99');
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('Morgan');
    await page.locator('[data-test="postalCode"]').fill('10001');
    await page.locator('[data-test="continue"]').click();
    assert.equal(await page.locator('[data-test="subtotal-label"]').innerText(), 'Item total: $29.99');
    assert.equal(await page.locator('[data-test="tax-label"]').innerText(), 'Tax: $2.40');
    assert.equal(await page.locator('[data-test="total-label"]').innerText(), 'Total: $32.39');
    assert.equal(await page.locator('[data-test="inventory-item-name"]').innerText(), 'Sauce Labs Backpack');
    await page.locator('[data-test="finish"]').click();
    await page.waitForURL(/\/checkout-complete\.html$/);
    assert.equal(await page.locator('[data-test="complete-header"]').innerText(), 'Thank you for your order!');
    assert.equal(await page.locator('[data-test="shopping-cart-badge"]').count(), 0);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-test="generate-pdf-order"]').click();
    const download = await downloadPromise;
    const filename = download.suggestedFilename();
    assert.match(filename, /\.pdf$/i, 'Order download should be a PDF');
    const downloadDir = path.resolve('downloads');
    fs.mkdirSync(downloadDir, { recursive: true });
    const savedPdf = path.join(downloadDir, filename);
    await download.saveAs(savedPdf);
    assert.ok(fs.statSync(savedPdf).size > 0, 'Downloaded order PDF should not be empty');

  } catch (error) {
    await page.screenshot({ path: 'checkout-failure.png', fullPage: true });
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
});
