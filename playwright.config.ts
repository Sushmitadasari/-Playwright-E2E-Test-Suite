import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the e-commerce checkout E2E suite.
 *
 * The target application is expected to be running at BASE_URL
 * (default http://localhost:8080). Override with the BASE_URL env var.
 */
export default defineConfig({
  // Where the tests (specs) live.
  testDir: './tests/specs',

  // Fail the build if a test.only is committed by mistake (CI only).
  forbidOnly: !!process.env.CI,

  // Run tests in files in parallel.
  fullyParallel: true,

  // Retry on CI to smooth over infrastructure flakiness; never locally.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel workers on CI for more deterministic runs.
  workers: process.env.CI ? 1 : undefined,

  // HTML report, written to ./playwright-report and not auto-opened.
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Directory for per-test artifacts (screenshots, videos, traces).
  outputDir: 'test-results',

  use: {
    // Base URL so Page Objects can navigate with relative paths.
    baseURL: process.env.BASE_URL ?? 'http://localhost:8080',

    // Capture a screenshot only when a test fails.
    screenshot: 'only-on-failure',

    // Keep the video only when a test fails.
    video: 'retain-on-failure',

    // Collect a trace on the first retry of a failing test.
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to run cross-browser. Requires the browsers to be installed
    // via `npx playwright install --with-deps`.
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
