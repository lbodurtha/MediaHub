import { test, expect } from '@playwright/test';

/**
 * MediaHub Sign-In page (/sign-in) — public route, Clerk-rendered widget.
 *
 * Based on QA report (mediahub-signin-page pair, verdict: match).
 * The sign-in card is rendered by our own SignInPage component around a Clerk
 * <SignIn> widget. We assert our shell structure (h1, Back button, subtitle,
 * disclaimer) but do NOT assert on Clerk's internal DOM — those class names
 * are not stable and auth is not testable with the test Clerk key.
 *
 * Waits: Clerk widget may take 200-500ms to paint after React mounts.
 * Using waitForSelector on the h1 covers that window.
 */
test.describe('MediaHub Sign-In page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    // Wait for the heading our component renders (not Clerk internals)
    await page.waitForSelector('h1', { timeout: 5000 });
  });

  test('page title is MediaHub', async ({ page }) => {
    await expect(page).toHaveTitle('MediaHub');
  });

  test('h1 "Welcome to MediaHub" is visible', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Welcome to MediaHub', level: 1 })
    ).toBeVisible();
  });

  test('"Back" button is visible and navigates to homepage', async ({ page }) => {
    const back = page.getByRole('button', { name: /back/i });
    await expect(back).toBeVisible();
    await back.click();
    await expect(page).toHaveURL('/');
  });

  test('subtitle "Professional media management" is visible', async ({ page }) => {
    await expect(
      page.getByText('Professional media management', { exact: false })
    ).toBeVisible();
  });

  test('terms disclaimer text is visible', async ({ page }) => {
    await expect(
      page.getByText('By signing in, you agree to our', { exact: false })
    ).toBeVisible();
  });

  test('navigating to /sign-in directly renders the sign-in card without errors', async ({ page }) => {
    // Re-navigate to verify the page is stable and no JS errors surface
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/sign-in');
    await page.waitForSelector('h1', { timeout: 5000 });
    // "Clerk: Failed to load Clerk" is expected with the test Clerk key in headless mode
    const fatal = errors.filter(
      (e) => !e.includes('Warning') && !e.toLowerCase().includes('clerk')
    );
    expect(fatal).toHaveLength(0);
    await expect(page.getByRole('heading', { name: 'Welcome to MediaHub' })).toBeVisible();
  });
});
