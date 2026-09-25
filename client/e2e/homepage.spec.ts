import { test, expect } from '@playwright/test';

/**
 * MediaHub Homepage (/) — public route, no auth required.
 *
 * Selectors and expected text are sourced from the QA exploration report
 * (mediahub-homepage-hero pair, verdict: match). The hero heading h1 contains
 * "Transform Your" on one line, then a <br> before "Media. Precisely." so
 * textContent does not contain a separating space. We assert partial matches
 * to be resilient to that rendering detail.
 */
test.describe('MediaHub Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title is MediaHub', async ({ page }) => {
    await expect(page).toHaveTitle('MediaHub');
  });

  test('hero h1 is visible and contains branding copy', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Transform Your');
    await expect(heading).toContainText('Precisely');
  });

  test('hero description paragraph is visible', async ({ page }) => {
    // Short description below the h1 — partial match to avoid fragility
    await expect(
      page.getByText('Edit, convert, and stream', { exact: false })
    ).toBeVisible();
  });

  test('"Start Editing" CTA button is present', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Start Editing' });
    await expect(btn).toBeVisible();
  });

  test('"Try Streaming" CTA button is present', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Try Streaming' });
    await expect(btn).toBeVisible();
  });

  test('feature tag "HLS Streaming" is visible', async ({ page }) => {
    // The text appears in multiple elements (hero tags + feature cards); first() is sufficient
    await expect(page.getByText('HLS Streaming', { exact: false }).first()).toBeVisible();
  });

  test('feature tag "FFmpeg Processing" is visible', async ({ page }) => {
    await expect(page.getByText('FFmpeg Processing', { exact: false }).first()).toBeVisible();
  });

  test('footer Privacy Policy link exists', async ({ page }) => {
    await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible();
  });

  test('footer Terms of Service link exists', async ({ page }) => {
    await expect(page.getByRole('link', { name: /terms of service/i })).toBeVisible();
  });

  test('footer Contact Us link exists', async ({ page }) => {
    await expect(page.getByRole('link', { name: /contact us/i })).toBeVisible();
  });

  test('navbar brand "MediaHub" span is visible', async ({ page }) => {
    // The navbar brand is a <span> inside a click-to-home <div> (not an <a> element)
    // Match the first span whose text is exactly "MediaHub" (excludes footer / loader)
    await expect(
      page.locator('span').filter({ hasText: /^MediaHub$/ }).first()
    ).toBeVisible();
  });

  test('navbar has Docs, Videos, and Editor Studio nav buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Docs' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Videos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Editor Studio' })).toBeVisible();
  });
});
