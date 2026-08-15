import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutPage encapsulates interactions with the /checkout page.
 */
export class CheckoutPage extends BasePage {
  readonly shippingAddressInput: Locator;
  readonly paymentInfoInput: Locator;
  readonly confirmPurchaseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.shippingAddressInput = page.getByTestId('shipping-address');
    this.paymentInfoInput = page.getByTestId('payment-info');
    this.confirmPurchaseButton = page.getByTestId('confirm-purchase-button');
  }

  /**
   * Open the checkout page.
   */
  async goto(): Promise<void> {
    await this.navigate('/checkout');
  }

  /**
   * Fill in the shipping address field.
   */
  async fillShippingAddress(address: string): Promise<void> {
    await this.shippingAddressInput.fill(address);
  }

  /**
   * Fill in the payment information field.
   */
  async fillPaymentInfo(paymentInfo: string): Promise<void> {
    await this.paymentInfoInput.fill(paymentInfo);
  }

  /**
   * Confirm the purchase.
   */
  async confirmPurchase(): Promise<void> {
    await this.confirmPurchaseButton.click();
  }
}
