import { test, expect } from '@playwright/test';
import { AuthHelpers, createTestUser } from '../utils/auth-helpers';

test.describe('Dashboard Access', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
  });

  test('should display dashboard after successful login', async ({ page }) => {
    await authHelpers.login();
    
    // Should be on dashboard page
    await expect(page).toHaveURL(/dashboard/);
    
    // Should display dashboard title
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    
    // Should display key dashboard components
    await expect(page.getByTestId('stats-cards')).toBeVisible();
    await expect(page.getByTestId('team-performance')).toBeVisible();
    await expect(page.getByTestId('upcoming-reviews')).toBeVisible();
  });

  test('should require authentication to access dashboard', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should display user information in header', async ({ page }) => {
    await authHelpers.login();
    
    // Should show user menu
    await expect(page.getByTestId('user-menu')).toBeVisible();
    
    // Click user menu to see details
    await page.click('[data-testid="user-menu"]');
    
    // Should show user name and email
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
  });

  test('should navigate between dashboard tabs', async ({ page }) => {
    await authHelpers.login();
    
    // Should have tabs
    await expect(page.getByRole('tab', { name: /overview/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /performance/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /goals/i })).toBeVisible();
    
    // Click performance tab
    await page.click('text=Performance');
    await expect(page.getByText('Team Performance')).toBeVisible();
    
    // Click goals tab
    await page.click('text=Goals');
    await expect(page.getByText('Team Goals')).toBeVisible();
  });

  test('should display correct permissions based on user role', async ({ page }) => {
    await authHelpers.login();
    
    // Regular user should not see admin actions
    await expect(page.getByText('Create User')).not.toBeVisible();
    await expect(page.getByText('System Settings')).not.toBeVisible();
  });

  test('should handle dashboard data loading states', async ({ page }) => {
    await authHelpers.login();
    
    // Should show loading indicators while data loads
    await expect(page.getByTestId('loading-stats')).toBeVisible();
    
    // Wait for data to load
    await page.waitForLoadState('networkidle');
    
    // Loading indicators should be gone
    await expect(page.getByTestId('loading-stats')).not.toBeVisible();
    
    // Data should be displayed
    await expect(page.getByTestId('stats-cards')).toBeVisible();
  });

  test('should refresh data when refresh button is clicked', async ({ page }) => {
    await authHelpers.login();
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    
    // Click refresh button
    await page.click('[data-testid="refresh-button"]');
    
    // Should show loading state again
    await expect(page.getByTestId('loading-stats')).toBeVisible();
    
    // Data should reload
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('stats-cards')).toBeVisible();
  });
});