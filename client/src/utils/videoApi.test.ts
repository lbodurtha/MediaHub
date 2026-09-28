import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock env before importing videoApi so we don't need real env vars at
// module-load time — env.ts throws on missing VITE_CLERK_PUBLISHABLE_KEY,
// which would otherwise crash this test file during collection. vi.mock
// calls are hoisted, so the mock is registered before the import below.
vi.mock('../config/env', () => ({
  env: {
    VITE_BACKEND_URI: 'http://backend.test',
    VITE_CLERK_PUBLISHABLE_KEY: 'pk_test_stub',
  },
}));

import { videoApi } from './videoApi';

const ORIGINAL_FETCH = globalThis.fetch;

describe('videoApi.deleteVideo', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
    vi.restoreAllMocks();
  });

  it('sends a Bearer token from getToken() and no uploaderId body', async () => {
    const getToken = vi.fn(async () => 'the.jwt.token');
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Video deleted successfully' }),
    });

    const result = await videoApi.deleteVideo('video-123', getToken);

    expect(getToken).toHaveBeenCalledOnce();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const [url, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('/videos/video-123');
    expect((url as string).startsWith('http://backend.test')).toBe(true);
    expect(init.method).toBe('DELETE');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer the.jwt.token');
    expect(init.body).toBeUndefined();
    expect(result.message).toContain('deleted');
  });

  it('throws with the server message when the response is not ok', async () => {
    const getToken = vi.fn(async () => 'jwt');
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ message: 'You can only delete your own videos' }),
    });

    await expect(videoApi.deleteVideo('video-123', getToken)).rejects.toThrow(
      'You can only delete your own videos',
    );
  });

  it('rejects when getToken returns null (unauthenticated)', async () => {
    const getToken = vi.fn(async () => null);
    await expect(videoApi.deleteVideo('video-123', getToken)).rejects.toThrow(
      /Not authenticated/,
    );
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
