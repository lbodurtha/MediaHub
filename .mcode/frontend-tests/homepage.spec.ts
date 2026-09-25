import { test, expect } from "@playwright/test";

// Tests for the MediaHub homepage (/)
// Based on QA report: homepage-initial pair matched origin vs target.
// The hero section renders immediately with no async data dependencies.

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero heading is visible", async ({ page }) => {
    // QA observed: h1 text "Transform Your\nMedia. Precisely."
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Transform Your");
  });

  test("hero subheading is visible", async ({ page }) => {
    // QA observed: p element describing the platform
    await expect(
      page.locator(
        "p:has-text('Edit, convert, and stream video/image content')"
      )
    ).toBeVisible();
  });

  test("hero CTA buttons are present", async ({ page }) => {
    // QA observed: 'Start Editing' and 'Try Streaming' buttons in hero section
    await expect(
      page.getByRole("button", { name: "Start Editing" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Try Streaming" })
    ).toBeVisible();
  });

  test("capability pills are displayed", async ({ page }) => {
    // QA observed: span elements with feature labels
    await expect(page.locator("span:has-text('HLS Streaming')")).toBeVisible();
    await expect(
      page.locator("span:has-text('FFmpeg Processing')")
    ).toBeVisible();
    await expect(
      page.locator("span:has-text('15+ Editing Tools')")
    ).toBeVisible();
    await expect(page.locator("span:has-text('Cloud Storage')")).toBeVisible();
  });

  test("footer is present with copyright text", async ({ page }) => {
    // QA observed: footer with copyright notice
    await expect(
      page.locator(
        "footer:has-text('© 2025 MediaHub. All rights reserved.')"
      )
    ).toBeVisible();
  });

  test("footer policy links are present", async ({ page }) => {
    // QA observed: footer links for Privacy Policy and Terms of Service
    await expect(
      page.locator("footer a:has-text('Privacy Policy')")
    ).toBeVisible();
    await expect(
      page.locator("footer a:has-text('Terms of Service')")
    ).toBeVisible();
    await expect(
      page.locator("footer a:has-text('Contact Us')")
    ).toBeVisible();
  });
});
