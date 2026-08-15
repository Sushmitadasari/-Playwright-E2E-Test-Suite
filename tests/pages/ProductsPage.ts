import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductsPage encapsulates interactions with the /products page,
 * including dynamically-generated per-product locators.
 */
export class ProductsPage extends BasePage {
  readonly cartLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartLink = page.getByTestId('cart-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  /**
   * Open the products page.
   */
  async goto(): Promise<void> {
    await this.navigate('/products');
  }

  /**
   * Return the container locator for a specific product.
   */
  getProductItem(productId: string): Locator {
    return this.page.getByTestId(`product-item-${productId}`);
  }

  /**
   * Return the "add to cart" button locator for a specific product.
   */
  getAddToCartButton(productId: string): Locator {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  /**
   * Add a product to the cart by its id.
   */
  async addProductToCart(productId: string): Promise<void> {
    await this.getAddToCartButton(productId).click();
  }

  /**
   * Navigate to the cart via the cart link.
   */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Log the current user out.
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
