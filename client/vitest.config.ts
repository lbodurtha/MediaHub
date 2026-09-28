import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // e2e/ hosts Playwright specs which use their own test runner and are
    // invoked via `npx playwright test`. Excluding them here prevents Vitest
    // from trying to collect them (and crashing on Playwright's test.describe).
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
