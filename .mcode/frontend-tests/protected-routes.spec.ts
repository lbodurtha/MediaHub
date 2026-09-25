import { test, expect } from "@playwright/test";

// Tests for protected routes — Videos, Docs, Editor Studio
// Based on QA report: all three show BrandedLoader indefinitely because
// VITE_CLERK_PUBLISHABLE_KEY is a placeholder, so Clerk isLoaded never becomes true.
// PrivateRoute renders <BrandedLoader message="Securing your session and loading MediaHub" />

const LOADER_MESSAGE = "Securing your session and loading MediaHub";

test.describe("Protected routes — BrandedLoader state", () => {
  test("Videos route shows BrandedLoader", async ({ page }) => {
    // QA observed: /video-streaming renders BrandedLoader (not VideoStreamingNew)
    await page.goto("/video-streaming");
    await expect(
      page.locator(`p:has-text('${LOADER_MESSAGE}')`)
    ).toBeVisible({ timeout: 10000 });
  });

  test("Docs route shows BrandedLoader", async ({ page }) => {
    // QA observed: /docs renders BrandedLoader (not Docs component)
    await page.goto("/docs");
    await expect(
      page.locator(`p:has-text('${LOADER_MESSAGE}')`)
    ).toBeVisible({ timeout: 10000 });
  });

  test("Editor Studio route shows BrandedLoader", async ({ page }) => {
    // QA observed: /media renders BrandedLoader (not MediaEditor component)
    await page.goto("/media");
    await expect(
      page.locator(`p:has-text('${LOADER_MESSAGE}')`)
    ).toBeVisible({ timeout: 10000 });
  });

  test("BrandedLoader has MediaHub heading", async ({ page }) => {
    // QA observed: h2 text "MediaHub" inside the BrandedLoader component
    await page.goto("/video-streaming");
    await expect(page.locator("h2:has-text('MediaHub')")).toBeVisible({
      timeout: 10000,
    });
  });
});
