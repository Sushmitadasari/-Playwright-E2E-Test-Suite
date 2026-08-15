import { type Page } from '@playwright/test';

/**
 * BasePage holds the Playwright `Page` handle and common navigation helpers
 * shared by every concrete Page Object. Concrete pages extend this class so
 * that all UI interaction and locator logic stays out of the spec files.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to the configured `baseURL`.
   */
  protected async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
