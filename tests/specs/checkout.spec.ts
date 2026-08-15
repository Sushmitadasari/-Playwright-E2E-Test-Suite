import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { testUser, testProduct, checkoutData } from '../fixtures/test-data';

/**
 * Bundle of instantiated Page Objects for a given page, so each test can
 * grab exactly the pages it needs without repeating instantiation logic.
 */
function createPages(page: Page) {
  return {
    loginPage: new LoginPage(page),
    productsPage: new ProductsPage(page),
    cartPage: new CartPage(page),
    checkoutPage: new CheckoutPage(page),
    confirmationPage: new ConfirmationPage(page),
  };
}

/**
 * Shared login helper to avoid duplicating login logic across tests.
 * Interaction is delegated entirely to the LoginPage Page Object.
 */
async function loginAsTestUser(loginPage: LoginPage): Promise<void> {
  await loginPage.goto();
  await loginPage.login(testUser.email, testUser.password);
}

test.describe('E-Commerce Checkout Flow', () => {
  test('should successfully complete the checkout flow', async ({ page }) => {
    const { loginPage, productsPage, cartPage, checkoutPage, confirmationPage } =
      createPages(page);

    // 1. Login
    await loginAsTestUser(loginPage);
    await expect(page).toHaveURL(/\/products/);

    // 2. Add a product to the cart from the products page
    await productsPage.addProductToCart(testProduct.id);

    // 3. Navigate to the cart
    await productsPage.goToCart();
    await expect(page).toHaveURL(/\/cart/);
    await expect(cartPage.getCartItem(testProduct.id)).toBeVisible();

    // 4. Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    // 5. Fill shipping and payment details
    await checkoutPage.fillShippingAddress(checkoutData.shippingAddress);
    await checkoutPage.fillPaymentInfo(checkoutData.paymentInfo);

    // 6. Confirm the purchase
    await checkoutPage.confirmPurchase();

    // 7. Verify the order confirmation message
    await expect(page).toHaveURL(/\/confirmation/);
    await expect(confirmationPage.confirmationMessage).toBeVisible();
  });

  test('should display an error when checking out with an empty cart', async ({
    page,
  }) => {
    const { loginPage, cartPage } = createPages(page);

    // 1. Login
    await loginAsTestUser(loginPage);

    // 2. Go straight to the cart without adding any product
    await cartPage.goto();

    // 3. Attempt to check out
    await cartPage.proceedToCheckout();

    // 4. The empty-cart message must be shown...
    await expect(cartPage.emptyCartMessage).toBeVisible();

    // 5. ...and the user must remain on the cart page (no navigation to checkout)
    await expect(page).toHaveURL(/\/cart/);
  });

  test('should preserve cart contents after session expiry and re-login', async ({
    page,
  }) => {
    const { loginPage, productsPage, cartPage, checkoutPage } = createPages(page);

    // 1. Login
    await loginAsTestUser(loginPage);

    // 2. Add product "1" to the cart
    await productsPage.addProductToCart(testProduct.id);

    // 3. Verify the product is in the cart
    await cartPage.goto();
    await expect(cartPage.getCartItem(testProduct.id)).toBeVisible();

    // 4 & 5. Simulate an expired session by clearing cookies/session state
    await page.context().clearCookies();

    // 6. Attempt to access a protected page
    await checkoutPage.goto();

    // 7. The app must redirect an unauthenticated user to /login
    await expect(page).toHaveURL(/\/login/);

    // 8. Log in again
    await loginPage.login(testUser.email, testUser.password);

    // 9 & 10. The previously added product must still be in the cart
    await cartPage.goto();
    await expect(cartPage.getCartItem(testProduct.id)).toBeVisible();
  });
});
