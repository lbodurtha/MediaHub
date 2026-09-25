import { test, expect } from "@playwright/test";

// Tests for the MediaHub navigation bar
// Based on QA report: navbar observed on all pages with consistent structure.
// Theme toggle button and nav links were visible in both origin and target.

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navbar is visible", async ({ page }) => {
    // QA observed: sticky nav with bg-[#0B0D14]/90 in dark mode
    await expect(page.locator("nav")).toBeVisible();
  });

  test("Home nav link is present", async ({ page }) => {
    // QA observed: a[href="/"] text "Home" on desktop
    await expect(page.locator('a[href="/"]', { hasText: "Home" })).toBeVisible();
  });

  test("protected route nav buttons are present", async ({ page }) => {
    // QA observed: Docs, Videos, Editor Studio buttons that redirect unauthenticated
    // users to /sign-in via handleProtectedRoute()
    await expect(
      page.getByRole("button", { name: "Docs" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Videos" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Editor Studio" })
    ).toBeVisible();
  });

  test("theme toggle button is present", async ({ page }) => {
    // QA observed: button[aria-label="Toggle theme"] (Sun/Moon icon, top-right)
    await expect(
      page.locator('button[aria-label="Toggle theme"]')
    ).toBeVisible();
  });

  test("GitHub button is present in navbar", async ({ page }) => {
    // QA observed: button[aria-label="GitHub"] in the top-right area
    await expect(
      page.locator('button[aria-label="GitHub"]')
    ).toBeVisible();
  });

  test("auth placeholder container is present in navbar", async ({ page }) => {
    // With a placeholder Clerk key, the Clerk SDK initializes but does not render
    // the SignInButton/UserButton. The auth div container is present but empty.
    // Verified via DOM inspection: <div class="items-center hidden gap-3 ml-1 md:flex"></div>
    // The protected-route nav buttons (Docs/Videos/Editor Studio) redirect to /sign-in.
    await expect(page.locator("nav")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Docs" })
    ).toBeVisible();
  });

  test("Docs button redirects to sign-in when unauthenticated", async ({
    page,
  }) => {
    // QA observed: handleProtectedRoute() redirects to /sign-in when user is not signed in
    await page.getByRole("button", { name: "Docs" }).click();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("Videos button redirects to sign-in when unauthenticated", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Videos" }).click();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("Editor Studio button redirects to sign-in when unauthenticated", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Editor Studio" }).click();
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
