import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ConfirmationPage encapsulates interactions with the /confirmation page.
 */
export class ConfirmationPage extends BasePage {
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationMessage = page.getByTestId('order-confirmation-message');
  }

  /**
   * Whether the order confirmation message is visible.
   */
  async isOrderConfirmationVisible(): Promise<boolean> {
    return this.confirmationMessage.isVisible();
  }
}
