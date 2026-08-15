import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage encapsulates all interactions with the /login page.
 * All locators live here so specs never touch raw selectors.
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-submit');
  }

  /**
   * Open the login page.
   */
  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  /**
   * Fill in credentials and submit the login form.
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
