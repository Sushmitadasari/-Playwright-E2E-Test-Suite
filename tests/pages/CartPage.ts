import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage encapsulates interactions with the /cart page.
 */
export class CartPage extends BasePage {
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.getByTestId('checkout-button');
    this.emptyCartMessage = page.getByTestId('cart-empty-message');
  }

  /**
   * Open the cart page.
   */
  async goto(): Promise<void> {
    await this.navigate('/cart');
  }

  /**
   * Return the cart-item container locator for a specific product.
   */
  getCartItem(productId: string): Locator {
    return this.page.getByTestId(`cart-item-${productId}`);
  }

  /**
   * Click the checkout button to proceed to checkout.
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Whether the empty-cart message is currently visible.
   */
  async isEmptyCartMessageVisible(): Promise<boolean> {
    return this.emptyCartMessage.isVisible();
  }

  /**
   * Whether a given product is present in the cart.
   */
  async isProductInCart(productId: string): Promise<boolean> {
    return this.getCartItem(productId).isVisible();
  }
}
