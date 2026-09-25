import { describe, it, expect, vi } from 'vitest';
import { getEnvVar } from './env';

describe('getEnvVar', () => {
  it('returns the env var value when present', () => {
    vi.stubEnv('VITE_TEST_KEY', 'test-value');
    expect(getEnvVar('VITE_TEST_KEY')).toBe('test-value');
    vi.unstubAllEnvs();
  });

  it('returns the fallback when the env var is missing', () => {
    expect(getEnvVar('VITE_NONEXISTENT_KEY', 'fallback-value')).toBe('fallback-value');
  });

  it('throws when the env var is missing and no fallback is given', () => {
    expect(() => getEnvVar('VITE_NONEXISTENT_KEY')).toThrow(
      'Missing required environment variable: VITE_NONEXISTENT_KEY'
    );
  });
});
