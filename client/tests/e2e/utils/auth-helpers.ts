import { Page, expect } from '@playwright/test';

export class AuthHelpers {
  constructor(private page: Page) {}

  async login(email = 'test@example.com', password = 'testpassword') {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    
    // Wait for successful login redirect
    await expect(this.page).toHaveURL(/dashboard/);
  }

  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    
    // Wait for logout redirect
    await expect(this.page).toHaveURL(/login/);
  }

  async expectLoggedIn() {
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible();
  }

  async expectLoggedOut() {
    await expect(this.page).toHaveURL(/login/);
  }
}

export const createTestUser = () => ({
  email: 'test@example.com',
  password: 'TestPassword123!',
  name: 'Test User',
  department: 'Engineering',
  role: 'user'
});

export const createAdminUser = () => ({
  email: 'admin@example.com',
  password: 'AdminPassword123!',
  name: 'Admin User',
  department: 'IT',
  role: 'admin'
});