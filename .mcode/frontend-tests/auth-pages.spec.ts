import { test, expect } from "@playwright/test";

// Tests for sign-in and sign-up pages
// Based on QA report: signin-page-initial and signup-page-initial both matched.
// With placeholder Clerk key the widget renders as an empty container;
// tests assert only on the page wrapper and headings.

test.describe("Sign-in page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-in");
  });

  test("sign-in heading is visible", async ({ page }) => {
    // QA observed: h1 text "Welcome to MediaHub"
    await expect(
      page.locator("h1:has-text('Welcome to MediaHub')")
    ).toBeVisible();
  });

  test("sign-in subtitle is visible", async ({ page }) => {
    // QA observed: p text "Professional media management, editing, and streaming platform"
    await expect(
      page.locator(
        "p:has-text('Professional media management, editing, and streaming platform')"
      )
    ).toBeVisible();
  });

  test("back button is present", async ({ page }) => {
    // QA observed: button:has-text("Back") absolute top-left, navigates to /
    await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
  });

  test("MediaHub logo image is present", async ({ page }) => {
    // QA observed: img[alt="MediaHub"] inside rounded-2xl container
    await expect(page.locator('img[alt="MediaHub"]')).toBeVisible();
  });

  test("footer disclaimer text is present", async ({ page }) => {
    // QA observed: p text about Terms of Service and Privacy Policy
    await expect(
      page.locator(
        "p:has-text('By signing in, you agree to our Terms of Service')"
      )
    ).toBeVisible();
  });

  test("back button navigates to homepage", async ({ page }) => {
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Sign-up page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sign-up");
  });

  test("sign-up heading is visible", async ({ page }) => {
    // QA observed: h1 text "Get Started"
    await expect(page.locator("h1:has-text('Get Started')")).toBeVisible();
  });

  test("sign-up subtitle is visible", async ({ page }) => {
    // QA observed: p text "Create your account to access MediaHub's powerful media tools"
    await expect(
      page.locator(
        "p:has-text('Create your account to access MediaHub')"
      )
    ).toBeVisible();
  });

  test("back button is present", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
  });

  test("MediaHub logo image is present", async ({ page }) => {
    await expect(page.locator('img[alt="MediaHub"]')).toBeVisible();
  });

  test("footer disclaimer text is present", async ({ page }) => {
    // QA observed: p text about Terms of Service and Privacy Policy
    await expect(
      page.locator(
        "p:has-text('By signing up, you agree to our Terms of Service')"
      )
    ).toBeVisible();
  });

  test("back button navigates to homepage", async ({ page }) => {
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page).toHaveURL("/");
  });
});
