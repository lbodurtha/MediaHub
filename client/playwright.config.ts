import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    [
      'json',
      {
        outputFile: `${process.env.MCODE_DIR}/fe_testing/playwright-results.json`,
      },
    ],
  ],
  use: {
    // MediaHub Vite dev server on port 5173 (confirmed running at test time).
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
