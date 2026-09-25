import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('dotenv', () => ({ default: { config: vi.fn() } }));

const validEnv = {
  PORT: '3000',
  DATABASE_URI: 'mongodb://localhost:27017/mediahub',
  CLIENT_URI: 'http://localhost:3000',
  CLOUDINARY_NAME: 'my-cloud',
  CLOUDINARY_API_KEY: 'api-key-123',
  CLOUDINARY_API_SECRET: 'api-secret-456',
};

let envSchema: typeof import('./env.js')['envSchema'];

beforeEach(async () => {
  vi.stubGlobal('process', { ...process, exit: vi.fn(), env: { ...validEnv } });
  const mod = await import('./env.js');
  envSchema = mod.envSchema;
});

describe('env schema validation', () => {
  it('should pass with all valid env vars', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(3000);
      expect(result.data.DATABASE_URI).toBe('mongodb://localhost:27017/mediahub');
      expect(result.data.CLOUDINARY_NAME).toBe('my-cloud');
    }
  });

  it('should coerce PORT from string to number', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.PORT).toBe('number');
      expect(result.data.PORT).toBe(3000);
    }
  });

  it('should default PORT to 8000 when not provided', () => {
    const { PORT, ...envWithoutPort } = validEnv;
    const result = envSchema.safeParse(envWithoutPort);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8000);
    }
  });

  it('should default CLIENT_URI when not provided', () => {
    const { CLIENT_URI, ...envWithoutClientUri } = validEnv;
    const result = envSchema.safeParse(envWithoutClientUri);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.CLIENT_URI).toBe('http://localhost:5173');
    }
  });

  it('should fail when DATABASE_URI is missing', () => {
    const { DATABASE_URI, ...envWithoutDb } = validEnv;
    const result = envSchema.safeParse(envWithoutDb);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.path.join('.'));
      expect(issues).toContain('DATABASE_URI');
    }
  });

  it('should fail when DATABASE_URI is empty string', () => {
    const result = envSchema.safeParse({ ...validEnv, DATABASE_URI: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when CLOUDINARY_NAME is missing', () => {
    const { CLOUDINARY_NAME, ...env } = validEnv;
    const result = envSchema.safeParse(env);
    expect(result.success).toBe(false);
  });

  it('should fail when CLOUDINARY_API_KEY is missing', () => {
    const { CLOUDINARY_API_KEY, ...env } = validEnv;
    const result = envSchema.safeParse(env);
    expect(result.success).toBe(false);
  });

  it('should fail when CLOUDINARY_API_SECRET is missing', () => {
    const { CLOUDINARY_API_SECRET, ...env } = validEnv;
    const result = envSchema.safeParse(env);
    expect(result.success).toBe(false);
  });
});
