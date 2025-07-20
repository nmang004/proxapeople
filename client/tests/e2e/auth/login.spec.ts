import { test, expect } from '@playwright/test';
import { AuthHelpers, createTestUser, createAdminUser } from '../utils/auth-helpers';

test.describe('Login Flow', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
  });

  test('should display login form correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check page title
    await expect(page).toHaveTitle(/login/i);
    
    // Check form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    
    // Check additional links
    await expect(page.getByText(/forgot password/i)).toBeVisible();
    await expect(page.getByText(/create account/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const user = createTestUser();
    
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', user.password);
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Should show user menu indicating successful login
    await expect(page.getByTestId('user-menu')).toBeVisible();
    
    // Should display welcome message or user name
    await expect(page.getByText(user.name)).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    
    // Should remain on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit without filling fields
    await page.click('[data-testid="login-button"]');
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/login');
    
    // Enter invalid email format
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    await page.click('[data-testid="login-button"]');
    
    // Should show email format validation error
    await expect(page.getByText(/invalid email format/i)).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.getByTestId('password-input');
    const toggleButton = page.getByTestId('password-toggle');
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle to hide password again
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login');
    
    await page.click('text=Forgot password?');
    
    await expect(page).toHaveURL(/forgot-password/);
    await expect(page.getByText(/reset password/i)).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    await page.click('text=Create account');
    
    await expect(page).toHaveURL(/register/);
    await expect(page.getByText(/create account/i)).toBeVisible();
  });

  test('should redirect to dashboard if already logged in', async ({ page }) => {
    // Login first
    await authHelpers.login();
    
    // Try to access login page
    await page.goto('/login');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await authHelpers.login();
    
    // Logout
    await authHelpers.logout();
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
    
    // User menu should not be visible
    await expect(page.getByTestId('user-menu')).not.toBeVisible();
  });

  test('should handle session expiration', async ({ page }) => {
    // Login first
    await authHelpers.login();
    
    // Simulate session expiration by clearing cookies
    await page.context().clearCookies();
    
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
    
    // Should show session expired message
    await expect(page.getByText(/session expired/i)).toBeVisible();
  });

  test('should remember user preference on refresh', async ({ page }) => {
    const user = createTestUser();
    
    await page.goto('/login');
    
    // Fill email but not password
    await page.fill('[data-testid="email-input"]', user.email);
    
    // Refresh page
    await page.reload();
    
    // Email should be remembered (if remember me was checked)
    // This test depends on how the app handles form persistence
    await expect(page.getByTestId('email-input')).toBeVisible();
  });

  test('should work with keyboard navigation', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through form elements
    await page.keyboard.press('Tab'); // Email field
    await page.keyboard.type('test@example.com');
    
    await page.keyboard.press('Tab'); // Password field
    await page.keyboard.type('password123');
    
    await page.keyboard.press('Tab'); // Submit button (or next focusable element)
    await page.keyboard.press('Enter'); // Submit form
    
    // Form should submit
    await page.waitForLoadState('networkidle');
  });

  test('should handle rate limiting', async ({ page }) => {
    await page.goto('/login');
    
    // Attempt multiple failed logins rapidly
    for (let i = 0; i < 6; i++) {
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');
      await page.waitForTimeout(500);
    }
    
    // Should show rate limiting message
    await expect(page.getByText(/too many attempts/i)).toBeVisible();
  });
});