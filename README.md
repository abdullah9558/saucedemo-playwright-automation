# SauceDemo Playwright Automation

Automated end-to-end coverage for the primary SauceDemo purchase flow:

`Login -> select product -> add to cart -> checkout -> verify totals -> complete order -> download receipt PDF`

## Prerequisites

- Node.js 18 or newer
- Internet access to [SauceDemo](https://www.saucedemo.com/)

## Setup

```bash
npm ci
npx playwright install chromium
```

## Run

Headless:

```bash
npm test
```

Visible Chromium:

```bash
npm run test:headed
```

## Test coverage

The test verifies:

- Successful login with the supplied standard user
- Selected product name and price
- Cart item count and cart contents
- Checkout subtotal, tax, and total
- Successful order confirmation
- Cleared cart state after completion
- Completed, non-empty PDF receipt download

Stable `data-test` selectors are used where available. Each run creates a fresh browser context, uses Playwright's condition-based waiting, and saves `checkout-failure.png` when execution fails.

## Configuration

The following environment variables are optional:

- `BASE_URL`
- `SAUCE_USERNAME`
- `SAUCE_PASSWORD`

Defaults use the public SauceDemo assessment environment and credentials.

## Limitations

- Chromium only
- One product and one account
- Fixed demo catalogue prices
- PDF validation checks the download type and file size, not the receipt contents
