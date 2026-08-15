# Playwright E2E Test Suite — E-Commerce Checkout Flow

An end-to-end (E2E) test suite for a mock e-commerce web application, built with
[Playwright](https://playwright.dev/) and the **Page Object Model (POM)**. The
suite validates the full checkout journey and key failure scenarios, generates
rich debugging artifacts on failure, and runs automatically in CI via GitHub
Actions.

## Objective

This project demonstrates production-grade QA/DevOps automation practices:

- **Playwright** for fast, reliable, cross-browser automation with auto-waiting.
- **End-to-end testing** that exercises the app the way a real user would, from
  login through order confirmation.
- **Page Object Model** to separate UI/locator details from test logic, keeping
  specs readable and maintainable. Selectors live in one place per page.
- **CI/CD** with GitHub Actions to run the suite on every push and pull request.
- **Failure artifacts** — screenshots, videos, and traces — captured
  automatically so failures can be diagnosed without re-running locally.

## Tech Stack

- **Node.js** (v18+ recommended; CI uses Node 20)
- **TypeScript**
- **Playwright** (`@playwright/test`)
- **GitHub Actions** (CI)

## Project Structure

```text
.
├── tests/
│   ├── pages/                  # Page Object classes (all locators live here)
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── ConfirmationPage.ts
│   ├── specs/
│   │   └── checkout.spec.ts    # The three mandatory E2E scenarios
│   └── fixtures/
│       └── test-data.ts        # Centralized, non-secret test data
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI pipeline
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
├── .env.example
└── README.md
```

## The Target Application

The suite assumes the application under test is reachable at
`http://localhost:8080` (override with the `BASE_URL` environment variable). The
app exposes the following pages and `data-testid` attributes:

| Page            | Path            | Key `data-testid`s                                              |
| --------------- | --------------- | -------------------------------------------------------------- |
| Login           | `/login`        | `login-email`, `login-password`, `login-submit`                |
| Products        | `/products`     | `product-item-{id}`, `add-to-cart-{id}`, `cart-link`, `logout-button` |
| Cart            | `/cart`         | `cart-item-{id}`, `checkout-button`, `cart-empty-message`      |
| Checkout        | `/checkout`     | `shipping-address`, `payment-info`, `confirm-purchase-button`  |
| Confirmation    | `/confirmation` | `order-confirmation-message`                                   |

> This repository contains the **test suite only**. Start the target application
> separately before running the tests.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer and npm.
- The target e-commerce application running and reachable at `BASE_URL`.

## Installation

Install the project dependencies:

```bash
npm install
```

Install the Playwright browsers (add `--with-deps` on Linux/CI to also install OS
dependencies):

```bash
npx playwright install
```

```bash
npx playwright install --with-deps
```

Optionally, copy the environment template and adjust values:

```bash
cp .env.example .env
```

## Running Tests

Make sure the target application is running at `BASE_URL`, then run the full
suite:

```bash
npx playwright test
```

The same command is wired to the npm `test` script:

```bash
npm test
```

### Headed Mode

Watch the browser while tests run:

```bash
npx playwright test --headed
```

### Debugging

Step through tests with the Playwright Inspector:

```bash
npx playwright test --debug
```

The interactive UI mode is also available:

```bash
npx playwright test --ui
```

### HTML Report

After a run, open the generated HTML report:

```bash
npx playwright show-report
```

### Trace Viewer

Traces are captured on the first retry of a failing test. Open one with:

```bash
npx playwright show-trace path/to/trace.zip
```

You can also drag-and-drop a `trace.zip` into <https://trace.playwright.dev/>.

## Test Scenarios

All three scenarios live in `tests/specs/checkout.spec.ts` and interact with the
app exclusively through Page Objects.

1. **Successful checkout** — *"should successfully complete the checkout flow"*
   Login → add a product → open the cart → proceed to checkout → fill shipping
   and payment details → confirm purchase → assert the order confirmation
   message is visible.

2. **Empty cart checkout prevention** — *"should display an error when checking
   out with an empty cart"*
   Login → go straight to the cart → attempt checkout → assert the
   `cart-empty-message` is visible and the user stays on `/cart`.

3. **Expired session and cart preservation** — *"should preserve cart contents
   after session expiry and re-login"*
   Login → add product `1` → verify it is in the cart → clear cookies to
   simulate an expired session → attempt to open `/checkout` → assert redirect
   to `/login` → log in again → assert product `1` is still in the cart.

## Continuous Integration

The workflow at `.github/workflows/playwright.yml` runs on every push and pull
request to `main`/`master`. It:

1. Checks out the repository.
2. Sets up Node.js (with npm caching).
3. Installs dependencies with `npm ci`.
4. Installs Playwright browsers with `npx playwright install --with-deps`.
5. Runs the suite with `npx playwright test`.
6. Uploads the `playwright-report/` and `test-results/` directories as build
   artifacts using `actions/upload-artifact@v4` with `if: always()`, so reports
   are preserved even when tests fail.

## Failure Artifacts

Configured in `playwright.config.ts`:

- **Screenshots** — captured `only-on-failure`.
- **Videos** — retained `retain-on-failure`.
- **Traces** — collected `on-first-retry` for time-travel debugging.
- **HTML report** — written to `playwright-report/` for every run.

Per-test artifacts (screenshots, videos, traces) are written to
`test-results/`. Both directories are uploaded by the CI pipeline.

## License

MIT
