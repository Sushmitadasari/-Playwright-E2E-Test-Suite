/**
 * Centralized, non-secret test data for the sample e-commerce application.
 *
 * Credentials are the well-known demo credentials for the mock application
 * described in the assignment. They are not real secrets. If your local
 * application uses different demo credentials, override them via the
 * TEST_USER_EMAIL / TEST_USER_PASSWORD environment variables.
 */

export const testUser = {
  email: process.env.TEST_USER_EMAIL ?? 'testuser@example.com',
  password: process.env.TEST_USER_PASSWORD ?? 'password123',
};

export const testProduct = {
  id: '1',
};

export const checkoutData = {
  shippingAddress: '123 Test Street, Test City, TC 12345',
  paymentInfo: '4111111111111111',
};
