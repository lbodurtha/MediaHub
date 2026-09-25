import { test, expect } from "@playwright/test";

// Tests for backend API health endpoint
// Based on QA report: GET /health-123 → HTTP 200 "Hello World!"
// Backend runs on port 8000.

test.describe("Backend API", () => {
  test("health endpoint returns 200 Hello World!", async ({ request }) => {
    // QA observed: healthcheck GET /health-123 → HTTP 200 "Hello World!"
    const response = await request.get("http://localhost:8000/health-123");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Hello World!");
  });

  test("videos endpoint returns a JSON array", async ({ request }) => {
    // QA observed: GET /videos → JSON array of video objects
    const response = await request.get("http://localhost:8000/videos");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
